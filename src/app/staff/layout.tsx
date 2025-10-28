'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, History, User, LogOut, Menu, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  { name: 'My Jobs', href: '/staff/jobs', icon: Briefcase },
  { name: 'Payments', href: '/staff/payments', icon: IndianRupee },
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
      {/* Header - Responsive */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-primary rounded-lg sm:rounded-xl flex-shrink-0">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg md:text-xl font-bold text-foreground block truncate">
                  Staff Portal
                </span>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  CarWash Services
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container-custom px-4 py-4 sm:py-6 pb-20 sm:pb-24">
        {children}
      </main>

      {/* Bottom Navigation - Responsive */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg">
        <div className="grid grid-cols-5 gap-0.5 sm:gap-1 max-w-screen-xl mx-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 sm:py-3 text-[10px] sm:text-xs transition-all duration-200 relative',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className={cn(
                  'p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted'
                )}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-0.5 sm:mt-1 truncate max-w-full px-1">{item.name}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 sm:h-1 bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
