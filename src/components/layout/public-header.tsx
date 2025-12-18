import { Anchor } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sea-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-luffy-500 to-luffy-600 shadow-md shadow-luffy-200">
            <Anchor className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-sea-900">
            OP<span className="text-luffy-600">Tracker</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/sets" className="text-sm font-medium text-sea-600 transition-colors hover:text-luffy-600">
            Sets
          </Link>
          <Link href="/sealed" className="text-sm font-medium text-sea-600 transition-colors hover:text-luffy-600">
            Sealed Products
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-sea-700 hover:bg-sea-100 hover:text-sea-900">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 transition-all hover:from-luffy-600 hover:to-luffy-700 hover:shadow-luffy-300"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
