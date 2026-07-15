import type { Metadata } from 'next';
import ERC1155Form from '../../../components/forge/erc1155/ERC1155Form';

export const metadata: Metadata = {
  title: 'NFT ERC-1155 | Forgenix',
};

export default function Erc1155ForgePage() {
  return <ERC1155Form />;
}