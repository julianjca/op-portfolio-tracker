import { Footer } from '@/components/layout/footer';
import { PublicHeader } from '@/components/layout/public-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cream-50 via-white to-sea-50">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
