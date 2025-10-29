'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Search,
  X,
  CheckCircle,
  Package,
  ShoppingBag,
  Calendar,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { useAdminLogout } from '@/api/domains/auth/queries';
import { AdminRoutes } from '@/lib/constants/routes';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD001 has been placed',
    time: '5 min ago',
    read: false,
    icon: ShoppingBag,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Service booking #BK045 confirmed',
    time: '15 min ago',
    read: false,
    icon: Calendar,
  },
  {
    id: '3',
    type: 'product',
    title: 'Low Stock Alert',
    message: 'Car Shampoo is running low',
    time: '1 hour ago',
    read: false,
    icon: Package,
  },
  {
    id: '4',
    type: 'system',
    title: 'Payment Received',
    message: 'Payment of ₹1,299 received',
    time: '2 hours ago',
    read: true,
    icon: CheckCircle,
  },
];

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const logoutMutation = useAdminLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
    });
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-card border-b border-border backdrop-blur-xl bg-card/95 shadow-sm">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm bg-muted border-0"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Icon (Mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 sm:h-9 sm:w-9">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Theme Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {showThemeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowThemeMenu(false)}
                />
                <Card className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-card rounded-lg sm:rounded-xl shadow-xl border-2 border-border z-50">
                  <CardContent className="p-1.5 sm:p-2">
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
                          className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{option.label}</span>
                          {isActive && (
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary-foreground flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-8 w-8 sm:h-9 sm:w-9"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <Card className="absolute right-0 mt-2 w-[90vw] sm:w-96 bg-white dark:bg-card rounded-lg sm:rounded-xl shadow-2xl border-2 border-border z-50 max-h-[70vh] sm:max-h-[600px] overflow-hidden flex flex-col">
                  {/* Notification Header */}
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="text-xs flex-shrink-0">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-[10px] sm:text-xs h-7 sm:h-8">
                      Mark all as read
                    </Button>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {mockNotifications.map((notification, index) => {
                      const Icon = notification.icon;
                      return (
                        <div key={notification.id}>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className={`w-full p-3 sm:p-4 hover:bg-muted transition-colors text-left cursor-pointer ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                  <h4 className={`font-semibold text-xs sm:text-sm truncate ${
                                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary flex-shrink-0 mt-0.5 sm:mt-1 animate-pulse" />
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-0.5 sm:mb-1">
                                  {notification.message}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </button>
                          {index < mockNotifications.length - 1 && <Separator />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-2 sm:p-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-[10px] sm:text-xs h-7 sm:h-8"
                      onClick={() => {
                        router.push(AdminRoutes.NOTIFICATIONS || '/admin/notifications');
                        setShowNotifications(false);
                      }}
                    >
                      View All Notifications
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </Button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <Card className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-card rounded-lg sm:rounded-xl shadow-xl border-2 border-border z-50">
                  <CardContent className="p-2 sm:p-3">
                    {/* User Info */}
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 mb-1.5 sm:mb-2">
                      <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                        Admin User
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        admin@carwash.com
                      </p>
                    </div>
                    <Separator className="my-1.5 sm:my-2" />
                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        router.push(AdminRoutes.PROFILE);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-muted transition-colors text-foreground cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push(AdminRoutes.SETTINGS);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-muted transition-colors text-foreground cursor-pointer"
                    >
                      <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Settings</span>
                    </button>
                    <Separator className="my-1.5 sm:my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-destructive/10 transition-colors text-destructive cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Logout</span>
                    </button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
