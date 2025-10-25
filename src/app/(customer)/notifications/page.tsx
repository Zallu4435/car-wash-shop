'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Calendar,
  ShoppingBag,
  Clock,
  Filter,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockNotifications = [
  { 
    id: 1, 
    type: 'success', 
    icon: CheckCircle, 
    title: 'Order Delivered', 
    message: 'Your order #ORD001 has been delivered successfully to your address', 
    time: '2 hours ago', 
    read: false,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-950/30',
  },
  { 
    id: 2, 
    type: 'info', 
    icon: Calendar, 
    title: 'Booking Confirmed', 
    message: 'Premium Wash scheduled for Oct 25 at 10:00 AM. We\'ll send you a reminder before your appointment', 
    time: '5 hours ago', 
    read: false,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950/30',
  },
  { 
    id: 3, 
    type: 'warning', 
    icon: Package, 
    title: 'Order Shipped', 
    message: 'Your order #ORD002 is out for delivery. Expected to arrive today by 6:00 PM', 
    time: '1 day ago', 
    read: true,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-950/30',
  },
  { 
    id: 4, 
    type: 'promo', 
    icon: ShoppingBag, 
    title: 'Special Offer', 
    message: 'Get 20% off on all car wash services this weekend. Limited time offer!', 
    time: '2 days ago', 
    read: true,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/30',
  },
  { 
    id: 5, 
    type: 'reminder', 
    icon: Clock, 
    title: 'Service Due', 
    message: 'Your vehicle is due for regular maintenance service. Book now to keep it in top condition', 
    time: '3 days ago', 
    read: true,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950/30',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="hidden sm:flex"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter notifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="sm:hidden"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark all
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <Card 
                      key={notif.id} 
                      className={`border-2 transition-all hover:shadow-lg ${
                        !notif.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`p-3 ${notif.bgColor} rounded-xl flex-shrink-0`}>
                            <Icon className={`h-5 w-5 ${notif.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{notif.title}</h3>
                                {!notif.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                              </div>
                              {!notif.read && (
                                <Badge variant="default" className="text-xs flex-shrink-0">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{notif.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {!notif.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-xs h-8"
                                  >
                                    Mark as read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notif.id)}
                                  className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="h-3 w-3" />
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
            ) : (
              // Empty State
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'unread' 
                      ? 'You have no unread notifications' 
                      : filter === 'read'
                      ? 'You have no read notifications'
                      : 'You have no notifications at the moment'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
