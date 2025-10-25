'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMockData } from '@/lib/api/mockData';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Clock, ArrowRight } from 'lucide-react';

export default function OrdersLandingPage() {
  const orders = getMockData.orders();

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3);

  // Count order types
  const serviceOrders = orders.filter(order => 
    order.items.some(item => item.name.toLowerCase().includes('wash') || item.name.toLowerCase().includes('service'))
  );
  const productOrders = orders.filter(order => 
    order.items.some(item => !item.name.toLowerCase().includes('wash') && !item.name.toLowerCase().includes('service'))
  );

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const orderCategories = [
    {
      id: 'services',
      title: 'Car Wash Services',
      description: 'View your service bookings and appointments',
      icon: Car,
      count: serviceOrders.length,
      color: 'bg-blue-100 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      href: '/orders/services',
    },
    {
      id: 'products',
      title: 'Product Orders',
      description: 'Track your product purchases and deliveries',
      icon: ShoppingBag,
      count: productOrders.length,
      color: 'bg-purple-100 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      href: '/orders/products',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Orders</h1>
              <p className="text-muted-foreground mt-1">Track and manage all your orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          {/* Order Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Browse Orders By Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orderCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.id} href={category.href}>
                    <Card className="border-2 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-4 ${category.color} rounded-xl group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-8 w-8 ${category.iconColor}`} />
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-3xl font-bold text-foreground">{category.count}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {category.count === 1 ? 'order' : 'orders'}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            View All
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-6 mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-background px-4">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/orders/all">View All Orders</Link>
              </Button>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <ShoppingBag className="h-5 w-5 text-primary" />
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
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-muted-foreground">× {item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +{order.items.length - 2} more items
                          </p>
                        )}
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
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-background rounded-full mb-6 shadow-sm">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link href="/services">Browse Services</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
