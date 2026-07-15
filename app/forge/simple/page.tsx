import type { Metadata } from 'next';
import SimpleContractForm from '../../../components/forge/simple/SimpleContractForm';

export const metadata: Metadata = {
  title: 'Basic Contract | Forgenix',
};

export default function SimpleForgePage() {
  return <SimpleContractForm />;
}