'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, LogOut, Menu, IndianRupee, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { useStaffLogout, useStaffProfile } from '@/api/domains/staff';
import { StaffRoutes } from '@/lib/constants/routes';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Default avatar for staff without profile picture
const DEFAULT_AVATAR = '/images/avatars/default-avatar.svg';

const navigation = [
  { name: 'Dashboard', href: StaffRoutes.DASHBOARD, icon: LayoutDashboard },
  { name: 'My Jobs', href: StaffRoutes.JOBS, icon: Briefcase },
  { name: 'Payments', href: StaffRoutes.PAYMENTS, icon: IndianRupee },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useStaffLogout();
  const { data: profile } = useStaffProfile();
  const [avatarError, setAvatarError] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Reset avatar error when profile changes
  useEffect(() => {
    setAvatarError(false);
  }, [profile?.avatar]);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  // Check if on login page to hide header and navigation
  const isLoginPage = pathname.includes('/auth/login');

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
    });
  };

  // On login page, just render children without header/nav
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile?.avatar && !avatarError ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <img
                    src={DEFAULT_AVATAR}
                    alt="Default avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-sm sm:text-base md:text-lg font-bold text-foreground block truncate">
                  {profile?.name || 'Staff Portal'}
                </span>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {profile?.role || 'Eazy Wash'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary" />
                  ) : (
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary" />
                  )}
                </button>

                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 force-sheet-bg rounded-lg sm:rounded-xl shadow-lg border border-border py-2 z-50">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isActive = theme === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTheme(option.value);
                              setShowThemeMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                              }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0 cursor-pointer"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">Logout</span>
              </button>
            </div>
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
