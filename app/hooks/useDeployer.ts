import { useState } from 'react';
import { ethers } from 'ethers';
import { keccak256, toBytes } from 'viem';
import { useWalletClient } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI, ContractType } from '../lib/contracts';

export interface DeployFormData {
  contractType: ContractType;
  isAdvancedMode: boolean;
  requestWhiteLabel: boolean;
  currentFeeString: string;
  userCredits: number;
  address: string | undefined;
  feeWei: bigint;

  b20Type?: 'asset' | 'stablecoin';
  currencyCode?: string;

  mediaFile?: File | null;
  description?: string;
  socials?: any;
  onCreditDeducted?: (newCredits: number) => void;

  nftName?: string;
  tokenName?: string;
  tokenSymbol?: string;
  nftSymbol?: string;

  tokenSupply?: string;
  decimals?: number;
  nftSupply?: string;
  royaltyFee?: string;
  erc1155Amount?: string;

  msgText?: string;
  simpleName?: string;
}

export function useDeployer() {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('https://sepolia.basescan.org');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkName, setNetworkName] = useState('Base Sepolia');
  const [deployedAddress, setDeployedAddress] = useState('');

  const resetStates = () => {
    setTxHash('');
    setError('');
    setIsModalOpen(false);
  };

  const uploadToIPFS = async (data: DeployFormData): Promise<string> => {
    if (!data.mediaFile) throw new Error('Please select a file (Artwork or Logo).');

    const formData = new FormData();
    formData.append('file', data.mediaFile);

    const fileRes = await fetch('/api/ipfs/file', { method: 'POST', body: formData });
    if (!fileRes.ok) throw new Error('Image upload failed.');

    const fileData = await fileRes.json();
    const imageUrl = `ipfs://${fileData.ipfsHash}`;

    const metadata = {
      name: data.contractType === 'nft' || data.contractType === 'erc1155' ? data.nftName : data.tokenName,
      description: data.description,
      image: imageUrl,
      external_link: data.socials?.website,
      attributes: [
        { trait_type: 'Twitter', value: data.socials?.twitter },
        { trait_type: 'Discord', value: data.socials?.discord },
        { trait_type: 'Farcaster', value: data.socials?.farcaster },
        { trait_type: 'Telegram', value: data.socials?.telegram },
        { trait_type: 'Github', value: data.socials?.github },
        { trait_type: 'Tags', value: data.socials?.tags },
      ],
      isWhiteLabeled: data.requestWhiteLabel,
    };

    const jsonRes = await fetch('/api/ipfs/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });

    if (!jsonRes.ok) throw new Error('Metadata upload failed.');

    const jsonData = await jsonRes.json();
    return `ipfs://${jsonData.ipfsHash}`;
  };

  const deploy = async (data: DeployFormData) => {
    setIsLoading(true);
    resetStates();

    try {
      const win = window as any;
      if (!win.ethereum) throw new Error('Wallet not detected.');

      const provider = new ethers.BrowserProvider(win.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      if (Number(network.chainId) === 8453) {
        setExplorerUrl('https://basescan.org');
        setNetworkName('Base Mainnet');
      } else {
        setExplorerUrl('https://sepolia.basescan.org');
        setNetworkName('Base Sepolia');
      }

      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const fee = data.feeWei;

      let tx;
      let metadataURI = '';

      if (
        data.isAdvancedMode &&
        (data.contractType === 'token' ||
          data.contractType === 'b20' ||
          data.contractType === 'nft' ||
          data.contractType === 'erc1155')
      ) {
        metadataURI = await uploadToIPFS(data);
      }

      if (data.contractType === 'daily') {
        tx = await factoryContract.deployDailyStreak(data.msgText || 'GM', { value: fee });
      } else if (data.contractType === 'message') {
        tx = await factoryContract.deployMessage(data.msgText || '', { value: fee });
      } else if (data.contractType === 'simple') {
        tx = await factoryContract.deploySimpleContract(data.simpleName || '', { value: fee });
      } else if (data.contractType === 'token') {
        if (data.isAdvancedMode) {
          tx = await factoryContract.deployAdvancedERC20(
            data.tokenName || '',
            data.tokenSymbol || '',
            data.tokenSupply || '0',
            metadataURI,
            data.requestWhiteLabel,
            { value: fee },
          );
        } else {
          tx = await factoryContract.deploySimpleERC20(
            data.tokenName || '',
            data.tokenSymbol || '',
            data.tokenSupply || '0',
            data.requestWhiteLabel,
            { value: fee },
          );
        }
      } else if (data.contractType === 'b20') {
        const salt = keccak256(toBytes(`forgenix-b20-${data.tokenName}-${Date.now()}`));

        if (data.b20Type === 'stablecoin') {
          const b20SupplyCap = ethers.parseUnits(data.tokenSupply || '0', 6);
          tx = await factoryContract.deployAdvancedB20Stablecoin(
            salt,
            data.tokenName || '',
            data.tokenSymbol || '',
            data.currencyCode || '',
            b20SupplyCap,
            metadataURI,
            data.requestWhiteLabel,
            { value: fee },
          );
        } else {
          const b20Decimals = data.decimals || 18;
          const b20SupplyCap = ethers.parseUnits(data.tokenSupply || '0', b20Decimals);

          if (data.isAdvancedMode) {
            tx = await factoryContract.deployAdvancedB20(
              salt,
              data.tokenName || '',
              data.tokenSymbol || '',
              b20Decimals,
              b20SupplyCap,
              metadataURI,
              data.requestWhiteLabel,
              { value: fee },
            );
          } else {
            tx = await factoryContract.deploySimpleB20(
              salt,
              data.tokenName || '',
              data.tokenSymbol || '',
              b20Decimals,
              b20SupplyCap,
              data.requestWhiteLabel,
              { value: fee },
            );
          }
        }
      } else if (data.contractType === 'nft') {
        if (data.isAdvancedMode) {
          tx = await factoryContract.deployAdvancedNFT(
            data.nftName || '',
            data.nftSymbol || '',
            data.nftSupply || '0',
            metadataURI,
            data.royaltyFee || '0',
            data.requestWhiteLabel,
            { value: fee },
          );
        } else {
          tx = await factoryContract.deploySimpleNFT(
            data.nftName || '',
            data.nftSymbol || '',
            data.nftSupply || '0',
            data.requestWhiteLabel,
            { value: fee },
          );
        }
      } else if (data.contractType === 'erc1155') {
        if (data.isAdvancedMode) {
          tx = await factoryContract.deployAdvancedERC1155(
            metadataURI,
            data.erc1155Amount || '0',
            data.royaltyFee || '0',
            data.requestWhiteLabel,
            { value: fee },
          );
        } else {
          tx = await factoryContract.deploySimpleERC1155('', data.erc1155Amount || '0', data.requestWhiteLabel, {
            value: fee,
          });
        }
      }

      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      let extractedAddress = '';
      for (const log of receipt.logs) {
        try {
          const parsed = factoryContract.interface.parseLog(log);
          if (parsed && (parsed.name === 'ProxyDeployed' || parsed.name === 'DailyStreakDeployed')) {
            extractedAddress = parsed.name === 'DailyStreakDeployed' ? parsed.args[1] : parsed.args[0];
            break;
          }
        } catch (err) {}
      }

      if (
        data.requestWhiteLabel &&
        data.userCredits > 0 &&
        data.onCreditDeducted &&
        (data.contractType === 'token' ||
          data.contractType === 'b20' ||
          data.contractType === 'nft' ||
          data.contractType === 'erc1155')
      ) {
        data.onCreditDeducted(data.userCredits - 1);
      }

      setIsModalOpen(true);
      setDeployedAddress(extractedAddress);

      return true;
    } catch (error: any) {
      console.error('Raw deployment error:', error);

      const errorMessage = error.reason || error.message || '';

      if (errorMessage.includes('already claimed today')) {
        setError('already claimed today');
        return false;
      }

      if (error.code === 'CALL_EXCEPTION' && error.action === 'estimateGas') {
        const expectedFee = data.currentFeeString ? `${data.currentFeeString} ETH` : 'the required fee';
        setError(
          `Transaction simulation failed. Ensure you have enough ETH for gas, and the exact fee amount (${expectedFee}) was sent.`
        );
      } else {
        setError(errorMessage || 'An error occurred during the transaction.');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    txHash,
    error,
    explorerUrl,
    isModalOpen,
    setIsModalOpen,
    networkName,
    deployedAddress,
    deploy,
    resetStates,
  };
}
