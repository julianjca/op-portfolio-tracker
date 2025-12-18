import { Anchor } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-sea-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-luffy-500 to-luffy-600">
              <Anchor className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sea-900">
              OP<span className="text-luffy-600">Tracker</span>
            </span>
          </Link>
          <div className="flex gap-6">
            <Link href="/sets" className="text-sm text-sea-600 transition-colors hover:text-luffy-600">
              Sets
            </Link>
            <Link href="/sealed" className="text-sm text-sea-600 transition-colors hover:text-luffy-600">
              Sealed
            </Link>
            <Link href="/login" className="text-sm text-sea-600 transition-colors hover:text-luffy-600">
              Sign In
            </Link>
          </div>
          <p className="text-sm text-sea-500">© {new Date().getFullYear()} OPTracker. Not affiliated with Bandai.</p>
        </div>
      </div>
    </footer>
  );
}
