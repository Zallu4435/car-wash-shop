'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, DollarSign, History, User, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  { name: 'My Jobs', href: '/staff/jobs', icon: Briefcase },
  { name: 'Payments', href: '/staff/payments', icon: DollarSign },
  { name: 'History', href: '/staff/history', icon: History },
  { name: 'Profile', href: '/staff/profile', icon: User },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Menu className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Staff Portal</span>
                <p className="text-xs text-muted-foreground">CarWash Services</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container-custom px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 max-w-screen-xl mx-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-3 text-xs transition-all duration-200 relative',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className={cn(
                  'p-2 rounded-xl transition-colors',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-1">{item.name}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
