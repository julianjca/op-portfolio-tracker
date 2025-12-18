import { Anchor, BarChart3, Layers, Search, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

function FloatingCard({ delay, className }: { delay: string; className?: string }) {
  return (
    <div
      className={`absolute h-32 w-24 rounded-lg bg-gradient-to-br from-straw-300/30 to-straw-500/20 backdrop-blur-sm border border-straw-400/40 shadow-xl ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: delay,
      }}
    />
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-sea-200 bg-white p-8 shadow-sm transition-all duration-500 hover:border-luffy-300 hover:shadow-lg hover:shadow-luffy-100"
      style={{
        animation: 'fadeSlideUp 0.8s ease-out backwards',
        animationDelay: delay,
      }}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-luffy-500/5 transition-all duration-500 group-hover:bg-luffy-500/10" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-straw-400/5 transition-all duration-500 group-hover:bg-straw-400/10" />

      <div className="relative z-10">
        <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-luffy-500 to-luffy-600 p-3 shadow-md shadow-luffy-200">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-tight text-sea-900">{title}</h3>
        <p className="leading-relaxed text-sea-600">{description}</p>
      </div>
    </div>
  );
}

function StatBlock({ value, label, delay }: { value: string; label: string; delay: string }) {
  return (
    <div
      className="text-center"
      style={{
        animation: 'fadeSlideUp 0.8s ease-out backwards',
        animationDelay: delay,
      }}
    >
      <div className="text-4xl font-black tracking-tight text-luffy-600 md:text-5xl">{value}</div>
      <div className="mt-2 text-sm font-medium uppercase tracking-widest text-sea-500">{label}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cream-50 via-white to-sea-50">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-straw-200/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-sea-200/30 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-luffy-100/20 blur-[80px]" />
      </div>

      {/* Floating card decorations */}
      <FloatingCard delay="0s" className="left-[5%] top-[15%] rotate-[-15deg] opacity-60" />
      <FloatingCard delay="1s" className="right-[8%] top-[20%] rotate-[12deg] opacity-50" />
      <FloatingCard delay="2s" className="left-[12%] top-[60%] rotate-[8deg] opacity-40" />
      <FloatingCard delay="1.5s" className="right-[15%] top-[55%] rotate-[-8deg] opacity-55" />

      {/* Navigation */}
      <header className="relative z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-luffy-500 to-luffy-600 shadow-lg shadow-luffy-200">
              <Anchor className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-sea-900">
              OP<span className="text-luffy-600">Tracker</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/sets" className="text-sm font-medium text-sea-600 transition-colors hover:text-luffy-600">
              Browse Sets
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
              className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-lg shadow-luffy-200 transition-all hover:from-luffy-600 hover:to-luffy-700 hover:shadow-luffy-300"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-straw-300 bg-straw-100/80 px-4 py-2 text-sm backdrop-blur-sm"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards' }}
            >
              <Sparkles className="h-4 w-4 text-straw-600" />
              <span className="font-medium text-straw-700">Track your treasure</span>
            </div>

            {/* Headline */}
            <h1
              className="mb-8 text-5xl font-black tracking-tight text-sea-900 sm:text-6xl lg:text-7xl"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.1s' }}
            >
              Your One Piece TCG
              <br />
              <span className="bg-gradient-to-r from-luffy-500 via-luffy-600 to-luffy-500 bg-clip-text text-transparent">
                Portfolio Vault
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-sea-600 sm:text-xl"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.2s' }}
            >
              Track your cards, monitor market values, and discover undervalued treasures. The ultimate companion for
              serious One Piece TCG collectors.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.3s' }}
            >
              <Button
                asChild
                size="lg"
                className="h-14 bg-gradient-to-r from-luffy-500 to-luffy-600 px-8 text-base font-semibold text-white shadow-xl shadow-luffy-200 transition-all hover:from-luffy-600 hover:to-luffy-700 hover:shadow-luffy-300"
              >
                <Link href="/login">
                  Start Tracking Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 border-sea-300 bg-white/80 px-8 text-base font-semibold text-sea-700 backdrop-blur-sm hover:border-sea-400 hover:bg-sea-50"
              >
                <Link href="/sets">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Collection
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="mx-auto mt-24 grid max-w-3xl grid-cols-3 gap-8 rounded-2xl border border-sea-200 bg-white/60 py-12 shadow-sm backdrop-blur-sm"
            style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.5s' }}
          >
            <StatBlock value="2,000+" delay="0.6s" label="Cards Tracked" />
            <StatBlock value="20+" delay="0.7s" label="Sets Available" />
            <StatBlock value="Free" delay="0.8s" label="To Get Started" />
          </div>
        </section>

        {/* Features Section */}
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-bold tracking-tight text-sea-900 sm:text-4xl"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.4s' }}
            >
              Everything you need to <span className="text-luffy-600">manage your collection</span>
            </h2>
            <p
              className="mx-auto max-w-2xl text-sea-600"
              style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.5s' }}
            >
              From tracking individual cards to analyzing your entire portfolio, we&apos;ve built the tools serious
              collectors need.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Layers}
              title="Portfolio Management"
              description="Track raw cards, graded slabs, and sealed products all in one place. Record purchase prices, conditions, and watch your collection grow."
              delay="0.6s"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Price Intelligence"
              description="Monitor price history and trends across your collection. Identify market opportunities and make data-driven collecting decisions."
              delay="0.7s"
            />
            <FeatureCard
              icon={BarChart3}
              title="Portfolio Analytics"
              description="Visualize your collection's performance with detailed charts. Track total value, gains/losses, and set completion progress."
              delay="0.8s"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl border border-sea-200 bg-gradient-to-br from-sea-900 to-sea-950 p-12 shadow-2xl lg:p-16"
            style={{ animation: 'fadeSlideUp 0.8s ease-out backwards', animationDelay: '0.9s' }}
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-luffy-500/20 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-straw-400/10 blur-[80px]" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to track your treasure?
              </h2>
              <p className="mb-10 text-lg text-sea-200">
                Join collectors who trust OPTracker to manage their One Piece TCG portfolios. Free to start, no credit
                card required.
              </p>
              <Button
                asChild
                size="lg"
                className="h-14 bg-gradient-to-r from-luffy-500 to-luffy-600 px-10 text-base font-semibold text-white shadow-xl shadow-luffy-500/30 transition-all hover:from-luffy-400 hover:to-luffy-500 hover:shadow-luffy-400/40"
              >
                <Link href="/login">Create Your Free Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-sea-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-luffy-500 to-luffy-600">
                  <Anchor className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sea-900">
                  OP<span className="text-luffy-600">Tracker</span>
                </span>
              </Link>
              <div className="flex gap-8">
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
              <p className="text-sm text-sea-500">
                © {new Date().getFullYear()} OPTracker. Not affiliated with Bandai.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
