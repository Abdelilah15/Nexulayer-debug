import { redirect } from 'next/navigation';

// /deploy n'a pas de contenu propre : on redirige vers le mode de déploiement par défaut.
export default function DeployPage() {
  redirect('/deploy/simple');
}
