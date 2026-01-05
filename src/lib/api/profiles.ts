import { createClient } from '@/lib/supabase/client';

import type { Tables } from '@/types/database';

export type Profile = Tables<'profiles'>;

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as Profile;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('profiles').select('*').eq('username', username).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'username' | 'display_name' | 'avatar_url' | 'bio' | 'is_public'>>
): Promise<Profile> {
  const supabase = createClient();

  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();

  if (error) throw error;
  return data as unknown as Profile;
}

export async function checkUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  const supabase = createClient();

  let query = supabase.from('profiles').select('id').eq('username', username);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data === null;
}
