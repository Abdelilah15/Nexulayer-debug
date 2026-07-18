import type { Metadata } from 'next';
import SimpleContractForm from '../../../components/deploy/simple/SimpleContractForm';

export const metadata: Metadata = {
  title: 'Basic Contract | Nexulayer',
};

export default function SimpleDeployPage() {
  return <SimpleContractForm />;
}
