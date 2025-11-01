'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  AlertCircle, 
  X,
  Settings,
  Loader2,
  CheckCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useInfiniteNotifications, useMarkAsRead, useMarkAllAsRead } from '@/api/domains/notifications/queries';
import type { Notification } from '@/types/notification';
import Loading from '@/components/shared/display/Loading';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

// Icon mapping for notification types
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order':
      return Package;
    case 'booking':
      return CheckCircle;
    case 'promotion':
      return ShoppingBag;
    case 'payment':
      return CheckCircle;
    case 'system':
      return AlertCircle;
    default:
      return Bell;
  }
};

// Format relative time
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export function NotificationPanel({ isOpen, onClose, isAuthenticated = false, isAdmin = false }: NotificationPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Fetch notifications with infinite scrolling - only if authenticated
  const { 
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteNotifications(
    activeTab === 'unread' ? { read: false } : undefined,
    isAuthenticated
  );
  
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Prevent body scroll when panel is open and prevent layout shift
  useEffect(() => {
    if (isOpen) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent scroll and add padding to compensate for scrollbar
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Ensure portal target exists
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, root: scrollContainerRef.current }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isAuthenticated, isOpen]);

  if (!mounted) return null;

  // Flatten all pages of notifications
  const notifications = data?.pages.flatMap(page => page.data) || [];
  const totalCount = data?.pages[0]?.total || 0;
  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = activeTab === 'unread' ? unreadNotifications : notifications;
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return createPortal(
    <>
      {/* Backdrop - Higher z-index */}
      <div 
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Desktop backdrop (subtle) */}
      <div 
        className={`hidden lg:block fixed inset-0 z-[1000] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Notification Panel */}
      <Card className={`fixed right-0 top-0 lg:top-16 lg:right-4 w-full lg:w-96 h-full lg:h-auto lg:min-h-[400px] lg:max-h-[85vh] rounded-none lg:rounded-lg shadow-2xl border-0 lg:border-2 lg:border-border z-[1001] overflow-hidden flex flex-col force-sheet-bg transition-all duration-500 ease-in-out ${
        isOpen 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full lg:translate-x-0 lg:translate-y-[-20px] opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex-shrink-0 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="text-xs font-bold">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={activeTab === 'unread' ? 'default' : 'outline'}
              size="sm"
              className="text-xs flex-1 h-8"
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`ml-1.5 text-xs ${
                    activeTab === 'unread' ? 'bg-primary-foreground text-primary' : ''
                  }`}
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs flex-1 h-8"
              onClick={() => setActiveTab('all')}
            >
              All
              <Badge variant="secondary" className={`ml-1.5 text-xs ${
                activeTab === 'all' ? 'bg-primary-foreground text-primary' : ''
              }`}>
                {notifications.length}
              </Badge>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 h-8"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-3 h-8"
              onClick={() => {
                router.push(isAdmin ? '/admin/notifications' : '/notifications');
                onClose();
              }}
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div ref={scrollContainerRef} className="overflow-y-auto flex-1 scrollbar-thin">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Login Required</p>
              <p className="text-xs text-muted-foreground text-center mb-4">Please login to view notifications</p>
              <Button
                size="sm"
                onClick={() => {
                  router.push('/auth/login');
                  onClose();
                }}
              >
                Login
              </Button>
            </div>
          ) : isLoading ? (
            <Loading text="Loading notifications..." fullScreen={false} size="md" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Failed to load notifications</p>
              <p className="text-xs text-muted-foreground text-center">Please try again later</p>
            </div>
          ) : displayNotifications.length > 0 ? (
            <>
              <div>
                {displayNotifications.map((notification, index) => {
                  const Icon = getNotificationIcon(notification.type);
                  
                  return (
                    <div key={notification.id}>
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full p-3 sm:p-4 hover:bg-accent transition-colors text-left cursor-pointer ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`font-semibold text-xs sm:text-sm ${
                                !notification.read ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground/80">
                              {getRelativeTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                      {index < displayNotifications.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>

              {/* Loading indicator for infinite scroll */}
              {isFetchingNextPage && (
                <Loading text="Loading more..." fullScreen={false} size="sm" />
              )}

              {/* End of list message */}
              {!hasNextPage && displayNotifications.length > 0 && (
                <div className="flex justify-center items-center py-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CheckCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">All caught up!</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {activeTab === 'unread' ? unreadCount : totalCount} total
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible div for intersection observer */}
              <div ref={observerTarget} className="h-2" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {activeTab === 'unread' ? 'All caught up!' : 'You have no notifications yet'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex-shrink-0 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-9 font-medium"
            onClick={() => {
              router.push(isAdmin ? '/admin/notifications' : '/notifications');
              onClose();
            }}
          >
            View All Notifications
          </Button>
        </div>
      </Card>
    </>,
    document.body
  );
}
