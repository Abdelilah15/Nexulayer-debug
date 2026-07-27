import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getAirdropBySlug } from '@/app/lib/airdrops';
import AirdropHeader from '@/components/airdrops/header/AirdropHeader';
import AirdropTasks from '@/components/airdrops/AirdropTasks';
import AirdropActions from '@/components/airdrops/actions/AirdropActions';

export const revalidate = 60;

export default async function AirdropDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const airdrop = await getAirdropBySlug(slug);

  if (!airdrop) {
    notFound();
  }

  return (
    <div className="min-h-full bg-background text-foreground p-4 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        {/* BACK BUTTON */}
        <Link
          href="/airdrops"
          className="mb-8 inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Airdrops
        </Link>

        <AirdropHeader airdrop={airdrop} />
        <AirdropActions airdropId={airdrop.id!} />
        <div className="mt-1">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-foreground">
            <span className="text-xl">🎯</span>
            Airdrop Tasks & Quests
          </h2>

          <AirdropTasks tasksRaw={airdrop.tasks} />
        </div>
      </div>
    </div>
  );
}
