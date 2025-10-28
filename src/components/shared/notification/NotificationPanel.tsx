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
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #ORD001 has been delivered successfully',
    time: '5 min ago',
    read: false,
    icon: Package,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your car wash service is confirmed for tomorrow at 10:00 AM',
    time: '1 hour ago',
    read: false,
    icon: CheckCircle,
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on premium car wash services this weekend',
    time: '2 hours ago',
    read: false,
    icon: ShoppingBag,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Service Due',
    message: 'Your car is due for maintenance service',
    time: '1 day ago',
    read: true,
    icon: AlertCircle,
  },
  {
    id: '5',
    type: 'order',
    title: 'Payment Received',
    message: 'Payment for order #ORD002 has been confirmed',
    time: '2 days ago',
    read: true,
    icon: Package,
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

  // Prevent body scroll when panel is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadNotifications = mockNotifications.filter(n => !n.read);
  const displayNotifications = activeTab === 'unread' ? unreadNotifications : mockNotifications;
  const unreadCount = unreadNotifications.length;

  return (
    <>
      {/* Backdrop - Higher z-index */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden" 
        onClick={onClose}
      />
      
      {/* Desktop backdrop (subtle) */}
      <div 
        className="hidden lg:block fixed inset-0 z-[100]" 
        onClick={onClose}
      />

      {/* Notification Panel */}
      <Card className="fixed lg:absolute right-0 top-0 lg:top-auto lg:mt-2 w-full lg:w-96 h-full lg:h-auto lg:max-h-[85vh] bg-card rounded-none lg:rounded-lg shadow-2xl border-0 lg:border-2 lg:border-border z-[101] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex-shrink-0 bg-card">
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
                {mockNotifications.length}
              </Badge>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 h-8"
              onClick={() => {
                // Mark all as read logic
              }}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-3 h-8"
              onClick={() => {
                router.push('/notifications');
                onClose();
              }}
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {displayNotifications.length > 0 ? (
            <div>
              {displayNotifications.map((notification, index) => {
                const Icon = notification.icon;
                
                return (
                  <div key={notification.id}>
                    <button
                      onClick={() => {
                        // Handle notification click
                        onClose();
                      }}
                      className={`w-full p-3 sm:p-4 hover:bg-accent transition-colors text-left ${
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
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                    {index < displayNotifications.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
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
        <div className="p-3 border-t border-border bg-muted/30 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-9 font-medium"
            onClick={() => {
              router.push('/notifications');
              onClose();
            }}
          >
            View All Notifications
          </Button>
        </div>
      </Card>
    </>
  );
}
