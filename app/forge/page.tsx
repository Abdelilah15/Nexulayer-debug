import { redirect } from 'next/navigation';

// /forge n'a pas de contenu propre : on redirige vers le mode de déploiement par défaut.
export default function ForgePage() {
  redirect('/forge/simple');
}