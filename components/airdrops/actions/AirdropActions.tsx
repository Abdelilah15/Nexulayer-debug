import { supabase } from '@/app/lib/supabase';
import LikeDislikeButtons from './LikeDislikeButtons';
import SaveButton from './SaveButton';

type Props = {
  airdropId: string;
};

export default async function AirdropActions({ airdropId }: Props) {
  // Fetch Total Counts using the public client (safe for unauthenticated reads)
  const { count: savesCount } = await supabase
    .from('airdrop_saves')
    .select('*', { count: 'exact', head: true })
    .eq('airdrop_id', airdropId);

  const { count: likesCount } = await supabase
    .from('airdrop_likes')
    .select('*', { count: 'exact', head: true })
    .eq('airdrop_id', airdropId)
    .eq('is_like', true);

  return (
    <div className="flex items-center justify-between w-full mb-6 p-2 border border-card rounded-full">
      <LikeDislikeButtons
        airdropId={airdropId}
        initialLikes={likesCount || 0}
      />
      <SaveButton
        airdropId={airdropId}
        initialSaves={savesCount || 0}
      />
    </div>
  );
}
