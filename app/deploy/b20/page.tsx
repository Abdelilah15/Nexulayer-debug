import type { Metadata } from 'next';
import B20Form from '../../../components/deploy/b20/B20Form';

export const metadata: Metadata = {
  title: 'Token B20 | Nexulayer',
};

export default function B20DeployPage() {
  return <B20Form />;
}
