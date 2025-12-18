'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile } from '@/lib/api/profiles';
import { queryKeys } from '@/lib/api/query-keys';

import type { Profile } from '@/lib/api/profiles';

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Pick<Profile, 'username' | 'display_name' | 'avatar_url' | 'bio' | 'is_public'>>) =>
      updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profiles.me, data);
      if (data.username) {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(data.username) });
      }
    },
  });
}
