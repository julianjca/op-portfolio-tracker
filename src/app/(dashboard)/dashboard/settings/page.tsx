'use client';

import { Settings } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '@/hooks/mutations/use-profile-mutations';
import { useCheckUsername, useProfile } from '@/hooks/queries/use-profile';
import { createClient } from '@/lib/supabase/client';

interface FormEdits {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  isPublic?: boolean;
}

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [edits, setEdits] = useState<FormEdits>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: profile, isLoading } = useProfile(userId ?? undefined);
  const updateProfile = useUpdateProfile(userId ?? '');

  const formValues = useMemo(
    () => ({
      displayName: edits.displayName ?? profile?.display_name ?? '',
      username: edits.username ?? profile?.username ?? '',
      bio: edits.bio ?? profile?.bio ?? '',
      avatarUrl: edits.avatarUrl ?? profile?.avatar_url ?? '',
      isPublic: edits.isPublic ?? profile?.is_public ?? false,
    }),
    [edits, profile]
  );

  const { data: usernameAvailable } = useCheckUsername(formValues.username, userId ?? undefined);

  const handleChange = useCallback((field: keyof FormEdits, value: string | boolean) => {
    setEdits((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = () => {
    updateProfile.mutate({
      display_name: formValues.displayName || null,
      username: formValues.username,
      bio: formValues.bio || null,
      avatar_url: formValues.avatarUrl || null,
      is_public: formValues.isPublic,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sea-900">
            <Settings className="h-8 w-8 text-sea-500" />
            Settings
          </h1>
          <p className="text-sea-600">Manage your profile and preferences</p>
        </div>
        <Card className="border-sea-200 bg-white">
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-luffy-500 border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sea-900">
          <Settings className="h-8 w-8 text-sea-500" />
          Settings
        </h1>
        <p className="text-sea-600">Manage your profile and preferences</p>
      </div>

      <Card className="border-sea-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sea-900">Profile Information</CardTitle>
          <CardDescription className="text-sea-500">Update your profile details visible to others</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sea-700">
              Display Name
            </Label>
            <Input
              id="displayName"
              value={formValues.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              placeholder="Your display name"
              className="border-sea-200 focus-visible:ring-luffy-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sea-700">
              Username
            </Label>
            <Input
              id="username"
              value={formValues.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Your username"
              className="border-sea-200 focus-visible:ring-luffy-500"
            />
            {formValues.username.length >= 3 && usernameAvailable !== undefined && (
              <p className={`text-sm ${usernameAvailable ? 'text-emerald-600' : 'text-luffy-600'}`}>
                {usernameAvailable ? 'Username is available' : 'Username is taken'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sea-700">
              Bio
            </Label>
            <textarea
              id="bio"
              value={formValues.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              className="flex min-h-[80px] w-full rounded-md border border-sea-200 bg-white px-3 py-2 text-sm text-sea-900 placeholder:text-sea-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luffy-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl" className="text-sea-700">
              Avatar URL
            </Label>
            <Input
              id="avatarUrl"
              value={formValues.avatarUrl}
              onChange={(e) => handleChange('avatarUrl', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="border-sea-200 focus-visible:ring-luffy-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formValues.isPublic}
              onCheckedChange={(checked) => handleChange('isPublic', checked === true)}
              className="border-sea-300 data-[state=checked]:bg-luffy-500 data-[state=checked]:border-luffy-500"
            />
            <Label htmlFor="isPublic" className="text-sea-700">
              Make profile public
            </Label>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 hover:from-luffy-600 hover:to-luffy-700"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
