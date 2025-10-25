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
    variant: 'success' as const,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your car wash service is confirmed for tomorrow at 10:00 AM',
    time: '1 hour ago',
    read: false,
    icon: CheckCircle,
    variant: 'info' as const,
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on premium car wash services this weekend',
    time: '2 hours ago',
    read: false,
    icon: ShoppingBag,
    variant: 'warning' as const,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Service Due',
    message: 'Your car is due for maintenance service',
    time: '1 day ago',
    read: true,
    icon: AlertCircle,
    variant: 'warning' as const,
  },
];

// Theme-compatible notification styles
const notificationStyles = {
  success: {
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  info: {
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  warning: {
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  error: {
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Notification Panel - Desktop: Dropdown, Mobile: Full Screen Overlay */}
      <Card className="fixed md:absolute right-0 md:right-0 top-0 md:top-auto md:mt-2 w-full md:w-96 h-full md:h-auto md:max-h-[600px] bg-card rounded-none md:rounded-xl shadow-2xl border-0 md:border border-border z-50 animate-fade-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 md:flex-none"
              onClick={() => {
                // Mark all as read logic
                onClose();
              }}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex-1 md:flex-none"
              onClick={() => {
                router.push('/notifications');
                onClose();
              }}
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {mockNotifications.length > 0 ? (
            <div>
              {mockNotifications.map((notification, index) => {
                const Icon = notification.icon;
                const styles = notificationStyles[notification.variant];
                
                return (
                  <div key={notification.id}>
                    <button
                      onClick={() => {
                        // Handle notification click
                        onClose();
                      }}
                      className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${styles.bgColor} rounded-xl flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${styles.iconColor}`} />
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No notifications</p>
              <p className="text-xs text-muted-foreground text-center">
                You're all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
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
