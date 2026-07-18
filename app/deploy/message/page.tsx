import type { Metadata } from 'next';
import MessageForm from '../../../components/deploy/message/MessageForm';

export const metadata: Metadata = {
  title: 'On-Chain Message | Nexulayer',
};

export default function MessageDeployPage() {
  return <MessageForm />;
}
