'use client';

import { Anchor } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithMagicLink, signInWithOAuth } from '@/lib/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);

    const result = await signInWithMagicLink(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    setLoading(true);
    setError(null);

    const result = await signInWithOAuth(provider);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream-50 via-white to-sea-50 p-4">
        <Card className="w-full max-w-md border-sea-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-straw-400 to-straw-500 shadow-md">
              <Anchor className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-sea-900">Check your email</CardTitle>
            <CardDescription className="text-sea-600">
              We sent a magic link to <span className="font-medium text-sea-800">{email}</span>. Click the link to sign
              in.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream-50 via-white to-sea-50 p-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-straw-200/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-sea-200/30 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-luffy-100/20 blur-[80px]" />
      </div>

      <Card className="relative w-full max-w-md border-sea-200 bg-white/90 shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-luffy-500 to-luffy-600 shadow-lg shadow-luffy-200">
              <Anchor className="h-5 w-5 text-white" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-sea-900">
            Welcome to OP<span className="text-luffy-600">Tracker</span>
          </CardTitle>
          <CardDescription className="text-sea-600">Sign in to track your One Piece TCG collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <div className="rounded-lg border border-luffy-200 bg-luffy-50 p-3 text-sm text-luffy-700">{error}</div>
          )}

          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sea-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-sea-200 focus:border-luffy-400 focus:ring-luffy-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 transition-all hover:from-luffy-600 hover:to-luffy-700 hover:shadow-luffy-300"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-sea-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-sea-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="border-sea-200 text-sea-700 hover:border-sea-300 hover:bg-sea-50"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuth('discord')}
              disabled={loading}
              className="border-sea-200 text-sea-700 hover:border-sea-300 hover:bg-sea-50"
            >
              Discord
            </Button>
          </div>

          <p className="text-center text-sm text-sea-500">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
