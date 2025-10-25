import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';

interface StatusItem {
  status: string;
  timestamp: string;
  label: string;
}

interface OrderTrackerProps {
  currentStatus: string;
  statusHistory: StatusItem[];
}

export function OrderTracker({ currentStatus, statusHistory }: OrderTrackerProps) {
  const statuses = [
    { id: 'processing', label: 'Order Placed', icon: Package },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home },
  ];

  const getCurrentStatusIndex = () => {
    return statuses.findIndex(s => s.id === currentStatus);
  };

  const currentIndex = getCurrentStatusIndex();

  const getStatusState = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <Card className="sticky top-24 border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Order Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statuses.map((status, index) => {
            const StatusIcon = status.icon;
            const state = getStatusState(index);
            const historyItem = statusHistory.find(h => h.status === status.id);

            return (
              <div key={status.id} className="relative">
                {/* Connector Line */}
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute left-5 top-11 w-0.5 h-12 ${
                      state === 'completed' 
                        ? 'bg-primary' 
                        : 'bg-border'
                    }`}
                  />
                )}

                {/* Status Item */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-2 flex-shrink-0 transition-all ${
                      state === 'completed'
                        ? 'bg-primary border-primary'
                        : state === 'active'
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <StatusIcon
                      className={`h-5 w-5 ${
                        state === 'completed'
                          ? 'text-primary-foreground'
                          : state === 'active'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p
                      className={`font-semibold ${
                        state === 'completed' || state === 'active'
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {status.label}
                    </p>
                    {historyItem && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {historyItem.timestamp}
                      </p>
                    )}
                    {state === 'active' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-primary">In Progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery */}
        {currentStatus !== 'delivered' && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Estimated Delivery
              </p>
              <p className="text-lg font-bold text-primary">
                Oct 26, 2025
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
