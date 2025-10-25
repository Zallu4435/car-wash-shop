'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Eye, 
  Mail,
  Phone,
  IndianRupee,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const customers = [
  {
    id: 'cust_001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    totalOrders: 12,
    totalSpent: 8430,
    joinedDate: '2025-01-15',
  },
  {
    id: 'cust_002',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43211',
    totalOrders: 8,
    totalSpent: 5240,
    joinedDate: '2025-02-20',
  },
  {
    id: 'cust_003',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91 98765 43212',
    totalOrders: 15,
    totalSpent: 12350,
    joinedDate: '2024-12-10',
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage your customer base and their activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{customers.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">
              ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Customers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{customer.name}</h3>
                        <p className="text-xs text-muted-foreground">Joined {customer.joinedDate}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => router.push(`/admin/customers/${customer.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Orders</p>
                      <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Spent</p>
                      <p className="text-lg font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">No customers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
