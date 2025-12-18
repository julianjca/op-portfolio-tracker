import { Anchor, BarChart3, CreditCard, LayoutDashboard, LogOut, Package, Settings } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/cards', label: 'Cards', icon: CreditCard },
  { href: '/dashboard/sealed', label: 'Sealed', icon: Package },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sea-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-luffy-500 to-luffy-600 shadow-md shadow-luffy-200">
              <Anchor className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-sea-900">
              OP<span className="text-luffy-600">Tracker</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-sea-600 transition-colors hover:bg-sea-100 hover:text-sea-900"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="text-sea-600 hover:bg-luffy-50 hover:text-luffy-700"
            size="sm"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </nav>
    </header>
  );
}
