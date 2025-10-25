'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Car, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const customer = {
  id: 'cust_001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  joinedDate: '2025-01-15',
  totalOrders: 12,
  totalSpent: 8430,
  vehicles: [
    { id: 'veh_001', brand: 'Toyota', model: 'Camry', plateNumber: 'MH12AB1234' },
    { id: 'veh_002', brand: 'Honda', model: 'City', plateNumber: 'MH14CD5678' },
  ],
  addresses: [
    { id: 'addr_001', label: 'Home', address: '123, MG Road, Bandra West, Mumbai - 400050' },
    { id: 'addr_002', label: 'Office', address: '456, Linking Road, Khar, Mumbai - 400052' },
  ],
  recentOrders: [
    { id: 'ORD001', type: 'service', name: 'Premium Wash', date: '2025-10-20', amount: 649, status: 'completed' },
    { id: 'ORD002', type: 'product', name: 'Car Shampoo', date: '2025-10-18', amount: 498, status: 'delivered' },
    { id: 'ORD003', type: 'service', name: 'Interior Detailing', date: '2025-10-15', amount: 699, status: 'completed' },
  ],
};

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/customers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Customer ID: {customer.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="font-semibold text-foreground">{customer.email}</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  </div>
                  <p className="font-semibold text-foreground">{customer.phone}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Member Since</p>
                </div>
                <p className="font-semibold text-foreground">{customer.joinedDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Vehicles ({customer.vehicles.length})</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-sm text-muted-foreground font-mono">{vehicle.plateNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Saved Addresses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{addr.label}</Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{addr.address}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Recent Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">{order.id}</Badge>
                        <Badge variant="secondary" className="capitalize">{order.type}</Badge>
                      </div>
                      <p className="font-semibold text-foreground">{order.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{order.amount}</p>
                      <Badge variant="default" className="text-xs mt-1 capitalize">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Customer Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Orders</p>
                </div>
                <p className="text-4xl font-bold text-foreground">{customer.totalOrders}</p>
                <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-green-900 dark:text-green-100 uppercase tracking-wide">Total Spent</p>
                </div>
                <p className="text-4xl font-bold text-foreground">₹{customer.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-green-900 dark:text-green-100 mt-1">Lifetime revenue</p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-purple-900 dark:text-purple-100 uppercase tracking-wide">Avg Order Value</p>
                </div>
                <p className="text-4xl font-bold text-foreground">₹{Math.round(customer.totalSpent / customer.totalOrders)}</p>
                <p className="text-xs text-purple-900 dark:text-purple-100 mt-1">Per order</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
