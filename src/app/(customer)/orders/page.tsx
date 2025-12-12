'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/api/domains/orders/queries';
import { useBookings } from '@/api/domains/bookings/queries';
import Loading from '@/components/shared/display/Loading';
import {
  Package,
  ShoppingBag,
  Car,
  Clock,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import Error from '@/components/shared/display/Error';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useMemo } from 'react';
import type { Booking } from '@/types/booking';
import type { Order } from '@/types/order';
import type { LucideIcon } from 'lucide-react';

// --- 1. Unified Type Definition ---
type ActivityType = 'service' | 'product';

interface UnifiedActivity {
  id: string;
  type: ActivityType;
  title: string;
  status: string;
  date: string;
  amount: number;
  detailLink: string;
  meta?: string;
}

export default function OrdersPage() {
  const {
    data: productData,
    isLoading: loadingProducts,
    error: productError
  } = useOrders({ limit: 5, page: 1 });

  const {
    data: serviceData,
    isLoading: loadingServices,
    error: serviceError
  } = useBookings({ limit: 5, page: 1 });

  const { recentOrders, stats } = useMemo(() => {
    const rawProducts: Order[] = productData?.data || [];
    const rawServices: Booking[] = serviceData?.data || [];

    const productTotal = productData?.total ?? rawProducts.length;
    const serviceTotal = serviceData?.total ?? rawServices.length;

    const normalizedProducts: UnifiedActivity[] = rawProducts.map(order => ({
      id: order.id,
      type: 'product',
      title: order.items?.[0]?.productName || `Order #${order.orderNumber}`,
      status: order.status,
      date: order.createdAt,
      amount: order.totalAmount ?? order.subtotal ?? 0,
      detailLink: CustomerRoutes.ORDER_PRODUCT_DETAIL(order.id),
      meta: order.orderNumber ? `#${order.orderNumber}` : undefined
    }));

    const normalizedServices: UnifiedActivity[] = rawServices.map(booking => ({
      id: booking.id,
      type: 'service',
      title: booking.serviceName,
      status: booking.status,
      date: booking.scheduledAt || booking.createdAt,
      amount: booking.amount || booking.totalAmount || 0,
      detailLink: CustomerRoutes.ORDER_SERVICE_DETAIL(booking.id),
      meta: booking.vehicleDetails ? `${booking.vehicleDetails.bodyType}` : undefined
    }));

    const combined = [...normalizedProducts, ...normalizedServices].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      recentOrders: combined.slice(0, 5),
      stats: {
        products: productTotal,
        services: serviceTotal
      }
    };
  }, [productData, serviceData]);

  const isLoading = loadingProducts || loadingServices;
  const error = productError || serviceError;
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message)
      : undefined;

  if (error) {
    return <Error message="Failed to load orders" details={errorMessage} />;
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <header className="bg-background border-b sticky top-0 z-20">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Your recent services and product purchases at a glance.</p>
        </div>
      </header>

      <main className="container-custom py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OverviewCard
            title="Active Services"
            count={stats.services}
            icon={Car}
            href={CustomerRoutes.ORDERS_SERVICES}
            color="text-blue-600"
            bgColor="bg-blue-50 dark:bg-blue-950/30"
            loading={isLoading}
          />
          <OverviewCard
            title="Product Orders"
            count={stats.products}
            icon={ShoppingBag}
            href={CustomerRoutes.ORDERS_PRODUCTS}
            color="text-purple-600"
            bgColor="bg-purple-50 dark:bg-purple-950/30"
            loading={isLoading}
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Orders & Services
            </h2>

          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Loading text="Loading recent orders..." />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((item) => (
                <ActivityItem key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            <EmptyOrdersState />
          )}
        </section>
      </main>
    </div>
  );
}

// --- Sub-Components ---

interface OverviewCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
  loading: boolean;
}

function OverviewCard({ title, count, icon: Icon, href, color, bgColor, loading }: OverviewCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full border hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-muted rounded" />
            ) : (
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold">{count}</h3>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${bgColor} ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({ item }: { item: UnifiedActivity }) {
  const isService = item.type === 'service';
  const Icon = isService ? Car : Package;
  const statusColor = getStatusColor(item.status);

  return (
    <Link href={item.detailLink}>
      <Card className="group hover:border-primary/40 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isService ? 'bg-blue-100/50 text-blue-600' : 'bg-purple-100/50 text-purple-600'}`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <Badge variant="outline" className={`hidden sm:inline-flex capitalize ${statusColor} border-0 bg-opacity-10`}>
                {item.status}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(item.date).toLocaleDateString()}
              </span>
              {item.meta && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">{item.meta}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="font-bold text-foreground">₹{item.amount}</p>
              <Badge variant="outline" className={`sm:hidden capitalize text-[10px] h-5 px-1.5 ${statusColor} border-0 bg-opacity-10`}>
                {item.status}
              </Badge>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyOrdersState() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">No orders yet</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Book a service or buy a product to get started.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={CustomerRoutes.SERVICES}>Book Service</Link>
          </Button>
          <Button asChild>
            <Link href={CustomerRoutes.PRODUCTS}>Shop Products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (['completed', 'delivered'].includes(s)) return 'text-green-600 bg-green-100';
  if (['cancelled', 'failed'].includes(s)) return 'text-red-600 bg-red-100';
  if (['pending', 'processing'].includes(s)) return 'text-amber-600 bg-amber-100';
  return 'text-slate-600 bg-slate-100';
}
