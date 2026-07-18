import type { Metadata } from 'next';
import ERC721Form from '../../../components/deploy/erc721/ERC721Form';

export const metadata: Metadata = {
  title: 'NFT ERC-721A | Nexulayer',
};

export default function Erc721DeployPage() {
  return <ERC721Form />;
}
