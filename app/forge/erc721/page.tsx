import type { Metadata } from 'next';
import ERC721Form from '../../../components/forge/erc721/ERC721Form';

export const metadata: Metadata = {
  title: 'NFT ERC-721A | Forgenix',
};

export default function Erc721ForgePage() {
  return <ERC721Form />;
}