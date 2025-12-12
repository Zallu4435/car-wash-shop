'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { useAdminLogout } from '@/api/domains/admin-settings/queries';
import { AdminRoutes } from '@/lib/constants/routes';
import { NotificationPanel } from '@/components/shared/notification/NotificationPanel';
import { useInfiniteNotifications } from '@/api/domains/notifications/queries';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}


// Default avatar for users without profile picture
const DEFAULT_AVATAR = '/images/avatars/default-avatar.svg';

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const logoutMutation = useAdminLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Fetch notifications to get unread count
  const { data: notificationsData } = useInfiniteNotifications({ read: false }, true);
  const unreadCount = notificationsData?.pages[0]?.total || 0;

  // Get avatar source with fallback
  const getAvatarSrc = () => {
    if (avatarError) {
      return DEFAULT_AVATAR;
    }
    // You can add actual admin user avatar here when available
    return DEFAULT_AVATAR;
  };

  // Handle avatar load error
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const handleLogout = () => {
    // The logout hook handles all cleanup (cookies, token, cache, redirect)
    logoutMutation.mutate(undefined);
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-background border-b-2 border-border backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between h-full px-2 sm:px-4 lg:px-6 gap-2 sm:gap-3">
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 cursor-pointer flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-7 sm:pl-9 lg:pl-10 pr-2 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm bg-muted border-2"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0">

          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
            >
              {theme === 'dark' ? (
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
                        <span className="flex-1 text-left">{option.label}</span>
                        {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative h-8 w-8 sm:h-9 sm:w-9 cursor-pointer"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Panel */}
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            isAuthenticated={true}
            isAdmin={true}
          />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 rounded-lg lg:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
            >
              <img
                src={getAvatarSrc()}
                alt="Admin User"
                onError={handleAvatarError}
                className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
              />
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 force-sheet-bg rounded-lg sm:rounded-xl shadow-lg border border-border overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-muted/30 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      admin@eazywash.com
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push(AdminRoutes.PROFILE);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push(AdminRoutes.SETTINGS);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                    </button>

                    <div className="h-px bg-border my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
