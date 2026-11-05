import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <AdminSidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-sm sm:h-16 sm:px-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span
              className="truncate text-sm font-bold tracking-tighter"
              style={{ fontFamily: 'Krona One' }}
            >
              GDP<span style={{ color: '#634BFA' }}>.</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/notifications" aria-label="System alerts">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="gradient-glow pointer-events-none absolute inset-x-0 top-14 h-32 opacity-50 sm:top-16" />
          <div className="relative p-3 sm:p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
