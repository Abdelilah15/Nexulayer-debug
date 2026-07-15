import type { Metadata } from 'next';
import MessageForm from '../../../components/forge/message/MessageForm';

export const metadata: Metadata = {
  title: 'On-Chain Message | Forgenix',
};

export default function MessageForgePage() {
  return <MessageForm />;
}