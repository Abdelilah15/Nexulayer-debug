import type { Metadata } from 'next';
import ERC20Form from '../../../components/deploy/erc20/ERC20Form';

export const metadata: Metadata = {
  title: 'Token ERC-20 | Nexulayer',
};

export default function Erc20DeployPage() {
  return <ERC20Form />;
}
