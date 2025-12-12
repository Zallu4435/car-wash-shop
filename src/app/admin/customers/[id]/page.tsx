'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Car, ShoppingBag, IndianRupee, TrendingUp, Ban, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useAdminCustomerDetail, useUpdateCustomerStatus } from '@/api/domains/admin-customers/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Fetch customer data
  const { data: customer, isLoading, error } = useAdminCustomerDetail(id);
  const updateStatusMutation = useUpdateCustomerStatus();

  // Use the confirmation hook
  const blockConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();

  const handleBlockClick = async () => {
    if (!customer) return;

    const confirmed = await blockConfirmation.confirm({
      type: 'block',
      title: 'Block Customer?',
      description: 'This customer will be blocked from placing new orders. They will not be able to access their account until unblocked.',
      confirmText: 'Yes, Block Customer',
      cancelText: 'Cancel',
      itemName: customer.name,
    });

    if (confirmed) {
      updateStatusMutation.mutate({ customerId: id, status: 'blocked' });
    }
  };

  const handleDeleteClick = async () => {
    if (!customer) return;

    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Customer?',
      description: 'This will permanently delete the customer account and all associated data including orders, vehicles, and addresses. This action cannot be undone.',
      confirmText: 'Yes, Delete Permanently',
      cancelText: 'Cancel',
      itemName: customer.name,
    });

    if (confirmed) {
      // TODO: Implement delete customer API
      toast.success(`Customer ${customer.name} has been deleted`);
      router.push(AdminRoutes.CUSTOMERS);
    }
  };

  // Loading state
  if (isLoading) {
    return <Loading text="Loading customer details..." />;
  }

  // Error state
  if (error || !customer) {
    return (
      <Error
        message="Failed to load customer"
        details={error?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.CUSTOMERS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Customers
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Customer Info */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 flex-shrink-0">
                  <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl mb-1">{customer.name}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">Customer ID: {customer.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{customer.email}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{customer.phone}</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Member Since</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{customer.joinedDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Vehicles ({customer.vehicles.length})</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {customer.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground capitalize">{vehicle.bodyType}</p>
                      <p className="text-sm text-muted-foreground capitalize">{vehicle.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Saved Addresses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{addr.type}</Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{addr.address}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {customer.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow border-2 border-transparent hover:border-primary/20">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Badge variant="outline" className="font-mono text-[10px] sm:text-xs">{order.id}</Badge>
                        <Badge variant="default" className="capitalize text-[10px] sm:text-xs">{order.status}</Badge>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-foreground truncate">{order.service}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        <Calendar className="h-3 w-3 inline mr-1 flex-shrink-0" />
                        {order.date}
                      </p>
                    </div>
                    <div className="text-left xs:text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-primary">₹{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Customer Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Orders</p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{customer.totalOrders}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">Lifetime</p>
                </div>

                <div className="p-2.5 sm:p-3 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Spent</p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">₹{(customer.totalSpent / 1000).toFixed(0)}K</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">Total</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Avg Order Value</p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">₹{Math.round(customer.totalSpent / customer.totalOrders)}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Per order</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <DangerZone
            description="Irreversible actions that affect this customer"
            actions={[
              {
                title: 'Block Customer',
                description: 'Prevent customer from making new bookings',
                buttonText: 'Block',
                buttonIcon: Ban,
                onClick: handleBlockClick,
                variant: 'outline',
                buttonClassName: 'border-orange-300 dark:border-orange-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30',
              },
              {
                title: 'Delete Customer',
                description: 'Permanently remove customer from system',
                buttonText: 'Delete',
                buttonIcon: Trash2,
                onClick: handleDeleteClick,
              },
            ]}
          />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <blockConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
