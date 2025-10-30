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
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInfiniteNotifications, useMarkAsRead, useMarkAllAsRead } from '@/api/domains/notifications/queries';
import { EmptyState } from '@/components/shared/display/EmptyState';
import Loading from '@/components/shared/display/Loading';
import { AdminRoutes } from '@/lib/constants/routes';
import { SearchFilter } from '@/components/admin/SearchFilter';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
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
    read: filterValues.status === 'all' || !filterValues.status ? undefined : filterValues.status === 'read' ? true : false,
  }, true);
  
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Get all notifications and apply client-side search/filter
  const allNotifications = data?.pages.flatMap(page => page.data) || [];
  
  // Apply search filter
  const notifications = React.useMemo(() => {
    let filtered = allNotifications;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower)
      );
    }
    
    // Type filter
    if (filterValues.type && filterValues.type !== 'all') {
      filtered = filtered.filter(n => n.type === filterValues.type);
    }
    
    return filtered;
  }, [allNotifications, search, filterValues]);
  
  const unreadCount = allNotifications.filter(n => !n.read).length;
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
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push(AdminRoutes.DASHBOARD)} 
          className="w-fit h-9 sm:h-10 text-xs sm:text-sm -ml-2"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <Bell className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
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
              className="w-full sm:w-auto h-9 text-xs sm:text-sm"
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Bell, label: 'Total', value: totalCount },
          { icon: AlertCircle, label: 'Unread', value: unreadCount },
          { icon: CheckCircle, label: 'Read', value: totalCount - unreadCount },
          { icon: Clock, label: 'Today', value: notifications.filter(n => {
            const today = new Date().toDateString();
            return new Date(n.createdAt).toDateString() === today;
          }).length },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate flex-1">{stat.label}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="border-2 border-border">
        <CardContent className="p-4 sm:p-6">
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search notifications by title or message..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Unread', value: 'unread' },
                  { label: 'Read', value: 'read' },
                ],
              },
              {
                label: 'Type',
                value: 'type',
                options: [
                  { label: 'All Types', value: 'all' },
                  { label: 'Order', value: 'order' },
                  { label: 'Booking', value: 'booking' },
                  { label: 'Product', value: 'product' },
                  { label: 'System', value: 'system' },
                  { label: 'Payment', value: 'payment' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {notifications.length > 0 ? (
            <>
              <div className="space-y-2.5 sm:space-y-3">
                {notifications.map((notif) => {
                  // Map notification type to icon and colors
                  const getNotificationIcon = (type: string) => {
                    switch (type) {
                      case 'order': return ShoppingBag;
                      case 'booking': return Calendar;
                      case 'product': return Package;
                      case 'system': return CheckCircle;
                      case 'payment': return CheckCircle;
                      default: return Bell;
                    }
                  };

                  const getNotificationColors = (type: string) => {
                    switch (type) {
                      case 'order': return { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-950/30' };
                      case 'booking': return { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' };
                      case 'product': return { color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-950/30' };
                      case 'system': return { color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-950/30' };
                      case 'payment': return { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' };
                      default: return { color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-950/30' };
                    }
                  };

                  const Icon = getNotificationIcon(notif.type);
                  const colors = getNotificationColors(notif.type);

                  return (
                    <Card 
                      key={notif.id} 
                      className={`border-2 transition-all hover:shadow-md ${
                        !notif.read ? 'bg-primary/5 border-primary/20' : 'border-border'
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          {/* Icon */}
                          <div className={`p-2 sm:p-2.5 ${colors.bgColor} rounded-lg sm:rounded-xl flex-shrink-0`}>
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
                                <span>{new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center gap-2 w-full xs:w-auto">
                                {!notif.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notif.id)}
                                    disabled={markAsReadMutation.isPending}
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
                <div className="mt-4">
                  <Loading text="Loading more notifications..." fullScreen={false} size="md" />
                </div>
              )}

              {/* End of list message */}
              {!hasNextPage && notifications.length > 0 && (
                <div className="flex justify-center items-center py-8 mt-4">
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
                search ? 'No matching notifications'
                : filterValues.status === 'unread' ? 'No unread notifications'
                : filterValues.status === 'read' ? 'No read notifications'
                : 'No notifications'
              }
              description={
                search
                  ? 'Try adjusting your search terms'
                  : filterValues.status === 'unread'
                  ? 'You have no unread notifications'
                  : filterValues.status === 'read'
                  ? 'You have no read notifications'
                  : 'You have no notifications at the moment'
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
