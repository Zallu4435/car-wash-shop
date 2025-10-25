'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockData } from '@/lib/api/mockData';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Bike, Home, ArrowLeft, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function ServiceOrdersPage() {
  const orders = getMockData.orders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  // Define service types with icons
  const serviceTypes = [
    { id: 'all', name: 'All Services', icon: Package },
    { id: 'car', name: 'Car Services', icon: Car },
    { id: 'bike', name: 'Bike Services', icon: Bike },
    { id: 'home', name: 'Home Cleaning', icon: Home },
  ];

  // Filter all service orders
  const allServiceOrders = orders.filter(order =>
    order.items.some(item =>
      item.name.toLowerCase().includes('wash') ||
      item.name.toLowerCase().includes('service') ||
      item.name.toLowerCase().includes('cleaning')
    )
  );

  // Apply filters
  const filteredOrders = allServiceOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;

    // Filter by service type
    let matchesServiceType = true;
    if (serviceTypeFilter !== 'all') {
      matchesServiceType = order.items.some(item => {
        const itemName = item.name.toLowerCase();
        if (serviceTypeFilter === 'car') {
          return itemName.includes('car');
        } else if (serviceTypeFilter === 'bike') {
          return itemName.includes('bike') || itemName.includes('two wheeler');
        } else if (serviceTypeFilter === 'home') {
          return itemName.includes('home') || itemName.includes('house') || itemName.includes('cleaning');
        }
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'default';
      case 'pending':
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getServiceIcon = (orderItems: any[]) => {
    const itemName = orderItems[0]?.name.toLowerCase() || '';
    if (itemName.includes('car')) return Car;
    if (itemName.includes('bike') || itemName.includes('two wheeler')) return Bike;
    if (itemName.includes('home') || itemName.includes('house') || itemName.includes('cleaning')) return Home;
    return Package;
  };

  const getServiceColor = (orderItems: any[]) => {
    const itemName = orderItems[0]?.name.toLowerCase() || '';
    if (itemName.includes('car')) return { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400' };
    if (itemName.includes('bike')) return { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-600 dark:text-green-400' };
    if (itemName.includes('home') || itemName.includes('cleaning')) return { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400' };
    return { bg: 'bg-primary/10', text: 'text-primary' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-500/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">All Services</h1>
              <p className="text-muted-foreground mt-1">
                {filteredOrders.length} service {filteredOrders.length === 1 ? 'booking' : 'bookings'}
              </p>
            </div>
          </div>

          {/* Quick Link */}
          <Button asChild variant="outline" className="mt-4" size="sm">
            <Link href="/orders/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Product Orders
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          {/* Service Type Tabs */}
          <Card className="mb-6 border-2 border-border">
            <CardContent className="p-6">
              <Tabs value={serviceTypeFilter} onValueChange={setServiceTypeFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
                  {serviceTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="flex items-center gap-2 py-3"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{type.name}</span>
                        <span className="sm:hidden">{type.name.split(' ')[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-6 border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or service name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const ServiceIcon = getServiceIcon(order.items);
                const colors = getServiceColor(order.items);

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${colors.bg} rounded-lg`}>
                            <ServiceIcon className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-foreground">{order.id}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{order.orderDate}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(order.status) as any}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4 p-4 bg-muted rounded-xl">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-muted-foreground">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                        </div>
                        <Button asChild variant="outline" className="group">
                          <Link href={`/orders/${order.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-background rounded-full mb-6 shadow-sm">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No service bookings found</h2>
              <p className="text-muted-foreground mb-8">
                {searchQuery || statusFilter !== 'all' || serviceTypeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Book a service to see your orders here'}
              </p>
              <Button asChild size="lg">
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
