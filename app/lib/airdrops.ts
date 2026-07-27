import { supabase, supabaseAdmin } from './supabase';

export type AirdropStep = {
  id?: string;
  step_order: number;
  title: string;
  content: string;
};

export type AirdropTask = {
  id?: string;
  title: string;
  status: 'Open' | 'Closed';
  deadline: string | null;
  reward_type: string;
  tags?: string;
  steps: AirdropStep[];
};

export type Investor = {
  name: string;
  logo: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' | 'Tier 5' | 'Others';
};

export type Airdrop = {
  id?: string;
  created_at?: string;
  title: string;
  slug: string;
  logo: string | null;
  description: string | null;
  situation?: string | null;
  is_rewarding?: boolean;
  category: string | null;
  status: string | null;
  raised_funds: string | null;
  investors: Investor[] | any;
  moni_score: number | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  github?: string | null;
  whitepaper?: string | null;
  gitbook?: string | null;
  linkedin?: string | null;
  medium?: string | null;
  tasks?: AirdropTask[] | any;
};

export async function getPublicAirdrops() {
  const { data, error } = await supabase
    .from('airdrops')
    .select('id, title, slug, logo, category, status, raised_funds, moni_score, description, situation, is_rewarding, website, twitter, discord, telegram, github, whitepaper, gitbook, linkedin, medium, investors, tasks')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch error: ${error.message}`);
  return data;
}

export async function getAirdropBySlug(slug: string): Promise<Airdrop | null> {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Fetch error: ${error.message}`);
  }

  return data as Airdrop;
}

export async function createAirdrop(airdropData: Airdrop) {
  const adminClient = supabaseAdmin();

  const { id, created_at, ...airdropFields } = airdropData;

  // 🌟 FIX: Forcefully remove 'steps' at runtime if it is stuck in the cache
  if ('steps' in airdropFields) {
    delete (airdropFields as any).steps;
  }

  const { data: newAirdrop, error: airdropError } = await adminClient
    .from('airdrops')
    .insert([airdropFields])
    .select()
    .single();

  if (airdropError) throw new Error(`Creation error: ${airdropError.message}`);
  return newAirdrop;
}

export async function updateAirdrop(id: string, airdropData: Airdrop) {
  const adminClient = supabaseAdmin();

  const { id: _, created_at, ...airdropFields } = airdropData;

  // 🌟 FIX: Forcefully remove 'steps' at runtime if it is stuck in the cache
  if ('steps' in airdropFields) {
    delete (airdropFields as any).steps;
  }

  const { error: airdropError } = await adminClient
    .from('airdrops')
    .update(airdropFields)
    .eq('id', id);

  if (airdropError) throw new Error(`Update error: ${airdropError.message}`);
  return true;
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabaseAdmin()
    .from('airdrops')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Deletion error: ${error.message}`);
  return true;
}
