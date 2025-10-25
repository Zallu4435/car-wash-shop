'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Tag, 
  Plus, 
  Search, 
  Eye, 
  Edit,
  Trash2,
  Percent,
  IndianRupee,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const coupons = [
  {
    id: 'coupon_001',
    code: 'FIRST20',
    type: 'percentage',
    value: 20,
    minOrderValue: 500,
    validUntil: '2025-12-31',
    usedCount: 234,
    usageLimit: 1000,
    active: true,
  },
  {
    id: 'coupon_002',
    code: 'WASH50',
    type: 'flat',
    value: 50,
    minOrderValue: 300,
    validUntil: '2025-11-30',
    usedCount: 89,
    usageLimit: 500,
    active: true,
  },
  {
    id: 'coupon_003',
    code: 'SAVE100',
    type: 'flat',
    value: 100,
    minOrderValue: 1000,
    validUntil: '2025-10-31',
    usedCount: 456,
    usageLimit: 500,
    active: false,
  },
];

export default function CouponsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCoupons = coupons.filter(c => c.active).length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount coupons and promotions</p>
        </div>
        <Button onClick={() => router.push('/admin/coupons/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{coupons.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Coupons</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{activeCoupons}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Uses</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalUsage}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupon List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Coupons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Coupon Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => (
              <Card key={coupon.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {coupon.type === 'percentage' ? (
                            <Percent className="h-5 w-5 text-primary" />
                          ) : (
                            <IndianRupee className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <h3 className="font-mono font-bold text-xl text-foreground">{coupon.code}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                      </p>
                    </div>
                    <Badge variant={coupon.active ? 'default' : 'secondary'}>
                      {coupon.active ? 'Active' : 'Expired'}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Min Order Value</p>
                      <p className="font-semibold text-foreground">₹{coupon.minOrderValue}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Used</p>
                        <p className="font-semibold text-foreground">{coupon.usedCount}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Limit</p>
                        <p className="font-semibold text-foreground">{coupon.usageLimit}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Valid Until</p>
                      <p className="font-semibold text-foreground">{coupon.validUntil}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/coupons/${coupon.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/coupons/${coupon.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
