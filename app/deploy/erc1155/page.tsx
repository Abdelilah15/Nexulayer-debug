import type { Metadata } from 'next';
import ERC1155Form from '../../../components/deploy/erc1155/ERC1155Form';

export const metadata: Metadata = {
  title: 'NFT ERC-1155 | Nexulayer',
};

export default function Erc1155DeployPage() {
  return <ERC1155Form />;
}
