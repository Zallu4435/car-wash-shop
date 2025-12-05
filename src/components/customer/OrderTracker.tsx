import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home,
  Wrench,
  UserCheck,
  PlayCircle,
  PackageCheck,
  XCircle,
} from 'lucide-react';

interface StatusItem {
  status: string;
  timestamp: string;
  label: string;
}

interface OrderTrackerProps {
  currentStatus: string;
  statusHistory: StatusItem[];
  isService?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

export function OrderTracker({ 
  currentStatus, 
  statusHistory, 
  isService = false,
  scheduledDate,
  scheduledTime 
}: OrderTrackerProps) {
  const normalizedCurrentStatus = (currentStatus || '').toLowerCase();
  const isCancelled = normalizedCurrentStatus === 'cancelled';

  // Different status flows for services vs orders
  const serviceStatuses = [
    { id: 'processing', label: 'Booking Placed', icon: Package },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'shipped', label: 'In Progress', icon: PlayCircle },
    { id: 'delivered', label: 'Completed', icon: UserCheck },
  ];

  const orderBaseStatuses = [
    { id: 'processing', label: 'Order Placed', icon: Package },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'packed', label: 'Packed', icon: PackageCheck },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home },
  ];

  const shouldShowCancelled =
    !isService &&
    (normalizedCurrentStatus === 'cancelled' ||
      statusHistory.some((item) => (item.status || '').toLowerCase() === 'cancelled'));

  const statuses = isService
    ? serviceStatuses
    : shouldShowCancelled
    ? [...orderBaseStatuses, { id: 'cancelled', label: 'Cancelled', icon: XCircle }]
    : orderBaseStatuses;

  const getCurrentStatusIndex = () => statuses.findIndex((s) => s.id === normalizedCurrentStatus);

  const currentIndex = getCurrentStatusIndex();

  const getStatusState = (index: number) => {
    if (isCancelled) {
      const statusId = statuses[index].id;
      return statusId === 'cancelled' ? 'cancelled' : 'cancelled-past';
    }
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const formatScheduledDateTime = () => {
    if (!scheduledDate) return null;
    
    try {
      // Try to parse the scheduled date
      const date = new Date(scheduledDate);
      if (isNaN(date.getTime())) {
        // If parsing fails, try to parse as YYYY-MM-DD format
        const [year, month, day] = scheduledDate.split('-');
        if (year && month && day) {
          const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(parsedDate.getTime())) {
            const formattedDate = parsedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            if (scheduledTime) {
              // Format time (assuming HH:MM format)
              const [hours, minutes] = scheduledTime.split(':');
              if (hours && minutes) {
                const hour12 = parseInt(hours) % 12 || 12;
                const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                return `${formattedDate} at ${hour12}:${minutes} ${ampm}`;
              }
              return `${formattedDate} at ${scheduledTime}`;
            }
            return formattedDate;
          }
        }
        return scheduledDate;
      }
      
      // Valid date object
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (scheduledTime) {
        const [hours, minutes] = scheduledTime.split(':');
        if (hours && minutes) {
          const hour12 = parseInt(hours) % 12 || 12;
          const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
          return `${formattedDate} at ${hour12}:${minutes} ${ampm}`;
        }
        return `${formattedDate} at ${scheduledTime}`;
      }
      return formattedDate;
    } catch (error) {
      // Fallback to raw values if formatting fails
      return scheduledTime ? `${scheduledDate} at ${scheduledTime}` : scheduledDate;
    }
  };

  return (
    <Card className="lg:sticky lg:top-24 border-2">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-base sm:text-lg">
            {isService ? 'Booking Status' : 'Order Status'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {statuses.map((status, index) => {
            const StatusIcon = status.icon;
            const state = getStatusState(index);
            const historyItem = statusHistory.find(h => h.status === status.id);

            return (
              <div key={status.id} className="relative">
                {/* Connector Line */}
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute left-[18px] sm:left-[22px] top-10 sm:top-12 w-[3px] h-8 sm:h-10 transition-all duration-300 rounded-full ${
                      !isCancelled && index < currentIndex
                        ? 'bg-green-500 dark:bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}

                {/* Status Item */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex-shrink-0 transition-all ${
                      state === 'completed'
                        ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 shadow-lg shadow-green-500/30'
                        : state === 'active'
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20'
                        : state === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-950 border-red-400 dark:border-red-500 shadow-lg shadow-red-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <StatusIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        state === 'completed'
                          ? 'text-white'
                          : state === 'active'
                          ? 'text-blue-600 dark:text-blue-400'
                        : state === 'cancelled'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        state === 'completed' || state === 'active'
                          ? 'text-foreground'
                          : state === 'cancelled'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {status.label}
                    </p>
                    {historyItem && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 break-all">
                        {historyItem.timestamp}
                      </p>
                    )}
                    {state === 'active' && 
                     normalizedCurrentStatus !== 'delivered' && 
                     normalizedCurrentStatus !== 'completed' &&
                     status.id !== 'delivered' && (
                      <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-200 dark:border-blue-800">
                        <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">In Progress</span>
                      </div>
                    )}
                    {state === 'cancelled' && (
                      <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-950 rounded-full border border-red-200 dark:border-red-800">
                        <div className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">Order Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery / Service Completion */}
        {normalizedCurrentStatus !== 'cancelled' && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg sm:rounded-xl border border-primary/20">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1">
                {isService 
                  ? (normalizedCurrentStatus === 'delivered' || normalizedCurrentStatus === 'completed' 
                      ? 'Scheduled On' 
                      : 'Scheduled For')
                  : 'Estimated Delivery'}
              </p>
              <p className="text-base sm:text-lg font-bold text-primary">
                {isService 
                  ? (formatScheduledDateTime() || 'As per booking schedule')
                  : 'Oct 26, 2025'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
