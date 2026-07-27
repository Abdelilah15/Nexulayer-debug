'use server';

import { supabaseAdmin } from '@/app/lib/supabase';
import { getSessionAddress } from '@/app/lib/auth/session';
import { revalidatePath } from 'next/cache';

// --- FETCH CURRENT USER STATE ---
export async function getUserAirdropState(airdropId: string) {
  const verifiedAddress = await getSessionAddress();
  if (!verifiedAddress) return { isSaved: false, likeState: null };

  const supabase = supabaseAdmin();

  const { data: userSave, error: saveError } = await supabase.from('airdrop_saves')
    .select('id').eq('user_id', verifiedAddress).eq('airdrop_id', airdropId).maybeSingle();

  if (saveError) console.error('Save fetch error:', saveError);

  const { data: userLike, error: likeError } = await supabase.from('airdrop_likes')
    .select('is_like').eq('user_id', verifiedAddress).eq('airdrop_id', airdropId).maybeSingle();

  if (likeError) console.error('Like fetch error:', likeError);

  return {
    isSaved: !!userSave,
    likeState: userLike ? (userLike.is_like ? 'liked' : 'disliked') : null
  };
}

// --- WATCHLIST / SAVES ---
export async function toggleSaveAction(airdropId: string, currentPath: string) {
  const verifiedAddress = await getSessionAddress();
  if (!verifiedAddress) return { success: false, error: 'You must sign in with your wallet to save an airdrop.' };

  const supabase = supabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from('airdrop_saves')
    .select('id')
    .eq('user_id', verifiedAddress)
    .eq('airdrop_id', airdropId)
    .maybeSingle();

  if (fetchError) return { success: false, error: 'Database verification failed.' };

  if (existing) {
    const { error } = await supabase.from('airdrop_saves').delete().eq('id', existing.id);
    if (error) return { success: false, error: 'Failed to remove airdrop from watchlist.' };
  } else {
    const { error } = await supabase.from('airdrop_saves').insert({ user_id: verifiedAddress, airdrop_id: airdropId });
    if (error) return { success: false, error: 'Failed to save airdrop to watchlist.' };
  }

  revalidatePath(currentPath);
  revalidatePath('/airdrops/watchlist');
  return { success: true };
}

// --- LIKES / DISLIKES ---
export async function toggleLikeAction(airdropId: string, actionType: 'like' | 'dislike' | 'remove', currentPath: string) {
  const verifiedAddress = await getSessionAddress();
  if (!verifiedAddress) return { success: false, error: 'You must sign in with your wallet to interact.' };

  const supabase = supabaseAdmin();

  if (actionType === 'remove') {
    const { error } = await supabase.from('airdrop_likes').delete().eq('user_id', verifiedAddress).eq('airdrop_id', airdropId);
    if (error) return { success: false, error: 'Failed to remove interaction.' };
  } else {
    const isLike = actionType === 'like';
    const { error } = await supabase
      .from('airdrop_likes')
      .upsert(
        { user_id: verifiedAddress, airdrop_id: airdropId, is_like: isLike },
        { onConflict: 'user_id, airdrop_id' }
      );
    if (error) return { success: false, error: 'Failed to register interaction.' };
  }

  revalidatePath(currentPath);
  return { success: true };
}
