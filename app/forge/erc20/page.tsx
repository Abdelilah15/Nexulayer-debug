import type { Metadata } from 'next';
import ERC20Form from '../../../components/forge/erc20/ERC20Form';

export const metadata: Metadata = {
  title: 'Token ERC-20 | Forgenix',
};

export default function Erc20ForgePage() {
  return <ERC20Form />;
}