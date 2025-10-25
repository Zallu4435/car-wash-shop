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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border backdrop-blur-xl bg-card/95 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon (Mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
            >
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {showThemeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowThemeMenu(false)}
                />
                <Card className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border-2 border-border z-50">
                  <CardContent className="p-2">
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
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{option.label}</span>
                          {isActive && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
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
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
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
                <Card className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-xl shadow-2xl border-2 border-border z-50 max-h-[600px] overflow-hidden flex flex-col">
                  {/* Notification Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <Badge variant="default">{unreadCount}</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs">
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
                            className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className={`font-semibold text-sm ${
                                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1 animate-pulse" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
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
                  <div className="p-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        router.push('/admin/notifications');
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
              className="rounded-full"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </Button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <Card className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border-2 border-border z-50">
                  <CardContent className="p-3">
                    {/* User Info */}
                    <div className="px-3 py-2 mb-2">
                      <p className="font-semibold text-foreground">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@carwash.com</p>
                    </div>
                    <Separator className="my-2" />
                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        router.push('/admin/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push('/admin/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <Separator className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
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
