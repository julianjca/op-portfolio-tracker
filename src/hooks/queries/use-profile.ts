'use client';

import { useQuery } from '@tanstack/react-query';

import { checkUsernameAvailable, getProfile, getProfileByUsername } from '@/lib/api/profiles';
import { queryKeys } from '@/lib/api/query-keys';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.me,
    queryFn: () => getProfile(userId as string),
    enabled: !!userId,
  });
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(username),
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
  });
}

export function useCheckUsername(username: string, excludeUserId?: string) {
  return useQuery({
    queryKey: ['username-check', username, excludeUserId],
    queryFn: () => checkUsernameAvailable(username, excludeUserId),
    enabled: username.length >= 3,
  });
}
