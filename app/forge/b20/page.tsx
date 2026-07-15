import type { Metadata } from 'next';
import B20Form from '../../../components/forge/b20/B20Form';

export const metadata: Metadata = {
  title: 'Token B20 | Forgenix',
};

export default function B20ForgePage() {
  return <B20Form />;
}