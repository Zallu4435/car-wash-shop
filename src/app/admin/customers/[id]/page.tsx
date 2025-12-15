'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    ShoppingBag,
    Car,
    MapPin,
    Ban,
    CheckCircle,
    TrendingUp,
    Clock,
    Package,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfirmation } from '@/hooks/useConfirmation';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminCustomerDetail, useUpdateCustomerStatus } from '@/api/domains/admin-customers/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const blockConfirmation = useConfirmation();
    const { data: customer, isLoading, error, refetch } = useAdminCustomerDetail(id);
    const updateStatus = useUpdateCustomerStatus();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return <Loading text="Loading customer details..." />;
    }

    if (error) {
        return (
            <Error
                message="Failed to load customer"
                details={(error as Error)?.message}
                onRetry={() => refetch()}
            />
        );
    }

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Customer not found</p>
                <Button onClick={() => router.push(AdminRoutes.CUSTOMERS)}>Back to Customers</Button>
            </div>
        );
    }

    const recentOrders = customer.recentOrders || [];
    const recentBookings = customer.recentBookings || [];
    const vehicles = customer.vehicles || [];
    const addresses = customer.addresses || [];

    const handleStatusChange = async () => {
        const newStatus = customer.status === 'active' ? 'suspended' : 'active';
        const confirmed = await blockConfirmation.confirm({
            type: customer.status === 'active' ? 'block' : 'warning',
            title: customer.status === 'active' ? 'Block Customer?' : 'Unblock Customer?',
            description: customer.status === 'active'
                ? 'This customer will be blocked and cannot place orders or book services.'
                : 'This customer will be unblocked and can use the platform again.',
            confirmText: customer.status === 'active' ? 'Yes, Block' : 'Yes, Unblock',
            cancelText: 'Cancel',
            itemName: customer.name,
        });
        if (confirmed) {
            await updateStatus.mutateAsync({ customerId: id, status: newStatus });
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(AdminRoutes.CUSTOMERS)}
                        className="h-9 w-9 rounded-lg border"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Customer Profile</h1>
                        <p className="text-sm text-muted-foreground">Manage and view customer details</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleStatusChange}
                    className={
                        customer.status === 'active'
                            ? 'border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950/30'
                            : 'border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/30'
                    }
                >
                    {customer.status === 'active' ? (
                        <>
                            <Ban className="mr-2 h-4 w-4" /> Block Customer
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Unblock Customer
                        </>
                    )}
                </Button>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - Customer Profile & Stats */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    {/* Profile Card */}
                    <Card className="border-2 overflow-hidden">
                        <div className="h-24 bg-gradient-to-br from-primary/80 via-primary to-primary/60" />
                        <CardContent className="pt-0 -mt-10 text-center">
                            <div className="w-20 h-20 mx-auto rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center">
                                <span className="text-3xl font-bold text-primary">
                                    {customer.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                            <h2 className="mt-3 text-xl font-bold text-foreground">{customer.name || 'Unknown'}</h2>
                            <Badge
                                className="mt-2"
                                variant={customer.status === 'active' ? 'default' : 'error'}
                            >
                                {customer.status === 'active' ? 'Active' : 'Blocked'}
                            </Badge>
                            <p className="mt-3 text-xs text-muted-foreground">
                                Member since {customer.joinedDate}
                            </p>

                            <Separator className="my-4" />

                            {/* Contact Info */}
                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <Phone className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-wide">Phone</p>
                                        <p className="text-sm font-medium truncate">{customer.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-wide">Email</p>
                                        <p className="text-sm font-medium truncate">{customer.email || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lifetime Stats */}
                    <Card className="border-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Lifetime Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                                <p className="text-xs text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(customer.totalSpent)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">{customer.totalOrders}</p>
                                    <p className="text-xs text-muted-foreground">Orders</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">{customer.totalBookings}</p>
                                    <p className="text-xs text-muted-foreground">Bookings</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Last Activity</p>
                                <p className="text-sm font-semibold">{customer.lastOrderDate || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Primary Address */}
                    {addresses.length > 0 && (
                        <Card className="border-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Primary Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {(() => {
                                    const primaryAddress = addresses.find(a => a.isPrimary) || addresses[0];
                                    return (
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50">
                                            <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                                                <MapPin className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        {primaryAddress.type}
                                                    </span>
                                                    {primaryAddress.isPrimary && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                                                            ✓ Primary
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed">{primaryAddress.address}</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Content Area - Tabs */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="bookings">Bookings</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-4 space-y-6">
                            {/* Order Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border bg-card shadow-sm">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <p className="text-3xl font-bold text-emerald-500">{customer.orderStats?.completed || 0}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Completed</p>
                                    </CardContent>
                                </Card>
                                <Card className="border bg-card shadow-sm">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                                            <Clock className="h-6 w-6 text-amber-500" />
                                        </div>
                                        <p className="text-3xl font-bold text-amber-500">{customer.orderStats?.pending || 0}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Pending</p>
                                    </CardContent>
                                </Card>
                                <Card className="border bg-card shadow-sm">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 flex items-center justify-center mb-3">
                                            <Ban className="h-6 w-6 text-rose-500" />
                                        </div>
                                        <p className="text-3xl font-bold text-rose-500">{customer.orderStats?.cancelled || 0}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Cancelled</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>Latest bookings and orders from this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recentOrders.length === 0 && recentBookings.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No recent activity</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentBookings.slice(0, 3).map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{booking.service}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-primary">{formatCurrency(booking.amount)}</p>
                                                        <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {recentOrders.slice(0, 3).map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                            <Package className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">Product Order</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-primary">{formatCurrency(order.amount)}</p>
                                                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* All Addresses */}
                            {addresses.length > 1 && (
                                <Card className="border-2">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            All Addresses ({addresses.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {addresses.map((address) => (
                                                <div key={address.id} className="p-4 rounded-xl bg-muted/50 border">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-xs">{address.type}</Badge>
                                                        {address.isPrimary && <Badge className="text-xs">Primary</Badge>}
                                                    </div>
                                                    <p className="text-sm text-foreground">{address.address}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="mt-4">
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Service Bookings
                                    </CardTitle>
                                    <CardDescription>All service bookings made by this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recentBookings.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No bookings found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentBookings.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{booking.service}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-bold text-primary">{formatCurrency(booking.amount)}</p>
                                                            <Badge
                                                                variant={
                                                                    booking.status === 'completed' ? 'default' :
                                                                        booking.status === 'pending' ? 'secondary' : 'error'
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {booking.status}
                                                            </Badge>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Orders Tab */}
                        <TabsContent value="orders" className="mt-4">
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        Product Orders
                                    </CardTitle>
                                    <CardDescription>All product orders made by this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recentOrders.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No orders found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                            <Package className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(order.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-bold text-primary">{formatCurrency(order.amount)}</p>
                                                            <Badge
                                                                variant={
                                                                    order.status === 'delivered' ? 'default' :
                                                                        order.status === 'pending' ? 'secondary' : 'error'
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Vehicles Tab */}
                        <TabsContent value="vehicles" className="mt-4">
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Car className="h-5 w-5 text-primary" />
                                        Registered Vehicles ({vehicles.length})
                                    </CardTitle>
                                    <CardDescription>Vehicles registered by this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {vehicles.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No vehicles registered</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {vehicles.map((vehicle) => (
                                                <div
                                                    key={vehicle.id}
                                                    className="p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-3xl">{vehicle.icon || '🚗'}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-foreground text-base capitalize">
                                                                {vehicle.brand} {vehicle.model}
                                                            </h4>
                                                            <p className="text-sm font-mono text-primary mt-1">
                                                                {vehicle.number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <blockConfirmation.ConfirmDialog />
        </div>
    );
}
