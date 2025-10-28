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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Coupons
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage discount coupons and promotions
          </p>
        </div>
        <Button onClick={() => router.push('/admin/coupons/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: Tag, color: 'purple', label: 'Total Coupons', value: coupons.length },
          { icon: Tag, color: 'green', label: 'Active Coupons', value: activeCoupons },
          { icon: TrendingUp, color: 'blue', label: 'Total Uses', value: totalUsage },
        ].map((stat, index) => (
          <Card key={index} className={`border-2 ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className={`p-2 sm:p-3 bg-${stat.color}-100 dark:bg-${stat.color}-950/30 rounded-lg sm:rounded-xl flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coupon List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Coupons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          {/* Coupon Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filteredCoupons.map((coupon) => (
              <Card key={coupon.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          {coupon.type === 'percentage' ? (
                            <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          ) : (
                            <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                        </div>
                        <h3 className="font-mono font-bold text-lg sm:text-xl text-foreground truncate">
                          {coupon.code}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                      </p>
                    </div>
                    <Badge variant={coupon.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {coupon.active ? 'Active' : 'Expired'}
                    </Badge>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                        Min Order Value
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        ₹{coupon.minOrderValue}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Used</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground">
                          {coupon.usedCount}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Limit</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground">
                          {coupon.usageLimit}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                        Valid Until
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {coupon.validUntil}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/coupons/${coupon.id}`)}
                    >
                      <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/coupons/${coupon.id}/edit`)}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
