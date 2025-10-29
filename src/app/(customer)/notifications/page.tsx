'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Calendar,
  ShoppingBag,
  Clock,
  Trash2,
  SlidersHorizontal,
  X,
  Loader2,
  CheckCheck
} from 'lucide-react';
import { useInfiniteNotifications, useMarkAsRead, useMarkAllAsRead } from '@/api/domains/notifications/queries';
import { EmptyState } from '@/components/shared/display/EmptyState';
import Loading from '@/components/shared/display/Loading';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // API calls with infinite scrolling
  const { 
    data,
    isLoading: notificationsLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteNotifications({
    read: filter === 'all' ? undefined : filter === 'read' ? true : false,
  }, true);
  
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.pages.flatMap(page => page.data) || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = data?.pages[0]?.total || 0;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const deleteNotification = (id: string) => {
    // Note: No delete API available yet, so we'll just mark as read
    markAsRead(id);
  };

  // Lock body scroll when mobile filter is open
  React.useEffect(() => {
    if (showFilters) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showFilters]);

  // Loading state
  if (notificationsLoading) {
    return <Loading text="Loading notifications..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Failed to Load Notifications</h2>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error loading your notifications. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <Bell className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
                  Notifications
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="hidden sm:flex h-9 text-xs sm:text-sm"
              >
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Filter bar removed; using the mobile sheet trigger below */}

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <>
                <div className="space-y-2.5 sm:space-y-3">
                  {notifications.map((notif) => {
                  // Map notification type to icon and colors
                  const getNotificationIcon = (type: string) => {
                    switch (type) {
                      case 'success': return CheckCircle;
                      case 'info': return Calendar;
                      case 'warning': return Package;
                      case 'promo': return ShoppingBag;
                      case 'reminder': return Clock;
                      default: return Bell;
                    }
                  };

                  const getNotificationColors = (type: string) => {
                    switch (type) {
                      case 'success': return { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' };
                      case 'info': return { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-950/30' };
                      case 'warning': return { color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-950/30' };
                      case 'promo': return { color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-950/30' };
                      case 'reminder': return { color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-950/30' };
                      default: return { color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-950/30' };
                    }
                  };

                  const Icon = getNotificationIcon(notif.type);
                  const colors = getNotificationColors(notif.type);

                  return (
                    <Card 
                      key={notif.id} 
                      className={`border-2 transition-all hover:shadow-lg ${
                        !notif.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                          {/* Icon */}
                          <div className={`p-2 sm:p-2.5 md:p-3 ${colors.bgColor} rounded-lg sm:rounded-xl flex-shrink-0`}>
                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                  {notif.title}
                                </h3>
                                {!notif.read && (
                                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                )}
                              </div>
                              {!notif.read && (
                                <Badge variant="default" className="text-[10px] sm:text-xs flex-shrink-0 px-1.5 sm:px-2">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                              {notif.message}
                            </p>
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-4">
                              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 w-full xs:w-auto">
                                {!notif.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 flex-1 xs:flex-initial"
                                  >
                                    Mark as read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notif.id)}
                                  className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="xs:hidden ml-1.5">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>

                {/* Loading indicator for infinite scroll */}
                {isFetchingNextPage && (
                  <Loading text="Loading more notifications..." fullScreen={false} size="md" />
                )}

                {/* End of list message */}
                {!hasNextPage && notifications.length > 0 && (
                  <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <CheckCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">You're all caught up!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalCount} notification{totalCount !== 1 ? 's' : ''} in total
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invisible div for intersection observer */}
                <div ref={observerTarget} className="h-4" />
              </>
            ) : (
              <EmptyState
                icon={Bell}
                title={
                  filter === 'unread' ? 'No unread notifications'
                  : filter === 'read' ? 'No read notifications'
                  : 'No notifications'
                }
                description={
                  filter === 'unread'
                    ? 'You have no unread notifications'
                    : filter === 'read'
                    ? 'You have no read notifications'
                    : 'You have no notifications at the moment'
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Filter Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-background/95 backdrop-blur-xl border-t border-border shadow-lg px-4 py-3">
          <Button
            variant="default"
            size="lg"
            className="w-full shadow-md h-12 text-sm font-semibold"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {filter !== 'all' && (
              <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground font-bold text-xs">
                1
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowFilters(false)}
          />
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col force-sheet-bg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0 vehicle-modal-bg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Filters</h2>
                  <p className="text-xs text-muted-foreground">{totalCount} total</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="rounded-full h-9 w-9">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-3 vehicle-modal-bg">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'read', label: 'Read' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFilter(opt.id)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      filter === opt.id ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border vehicle-modal-bg flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold text-sm"
                  onClick={() => setFilter('all')}
                >
                  Clear
                </Button>
                <Button
                  className="flex-1 h-11 font-semibold text-sm shadow-md"
                  onClick={() => setShowFilters(false)}
                >
                  Show {totalCount}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
