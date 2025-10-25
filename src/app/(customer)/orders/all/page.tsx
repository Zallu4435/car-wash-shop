'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/crud/Pagination';
import { getMockData } from '@/lib/api/mockData';
import { Package, Calendar, ChevronRight, ShoppingBag, ArrowLeft, Search, Filter, X, Car } from 'lucide-react';
import { useState } from 'react';

const ITEMS_PER_PAGE = 6;

export default function AllOrdersPage() {
  const orders = getMockData.orders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;

    let matchesType = true;
    if (typeFilter === 'services') {
      matchesType = order.items.some(item =>
        item.name.toLowerCase().includes('wash') ||
        item.name.toLowerCase().includes('service') ||
        item.name.toLowerCase().includes('cleaning')
      );
    } else if (typeFilter === 'products') {
      matchesType = order.items.some(item =>
        !item.name.toLowerCase().includes('wash') &&
        !item.name.toLowerCase().includes('service') &&
        !item.name.toLowerCase().includes('cleaning')
      );
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterSetter: (value: string) => void, value: string) => {
    filterSetter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all';

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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-500/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-xl">
              <Package className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">All Orders</h1>
              <p className="text-muted-foreground mt-1">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          {/* Desktop Filters */}
          <Card className="mb-6 border-2 border-border hidden md:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(value) => handleFilterChange(setTypeFilter, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => handleFilterChange(setStatusFilter, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters {hasActiveFilters && `(${[searchQuery !== '', statusFilter !== 'all', typeFilter !== 'all'].filter(Boolean).length})`}
            </Button>
          </div>

          {/* Mobile Sticky Filters */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-background">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Order Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
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
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border space-y-2">
                  {hasActiveFilters && (
                    <Button variant="outline" className="w-full" onClick={clearFilters}>
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowMobileFilters(false);
                      setCurrentPage(1);
                    }}
                  >
                    Show {filteredOrders.length} Results
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {paginatedOrders.length > 0 ? (
            <>
              <div className="space-y-4 mb-8">
                {paginatedOrders.map((order) => {
                  const isService = order.items.some(item =>
                    item.name.toLowerCase().includes('wash') ||
                    item.name.toLowerCase().includes('service') ||
                    item.name.toLowerCase().includes('cleaning')
                  );

                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isService
                                ? 'bg-blue-50 dark:bg-blue-950/20'
                                : 'bg-purple-50 dark:bg-purple-950/20'
                              }`}>
                              {isService ? (
                                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-mono font-bold text-foreground">{order.id}</p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{order.orderDate}</span>
                              </div>
                              <Badge variant="outline" className="mt-2">
                                {isService ? 'Service' : 'Product'}
                              </Badge>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredOrders.length}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-background rounded-full mb-6 shadow-sm">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-8">
                {hasActiveFilters
                  ? 'Try adjusting your filters to find what you\'re looking for'
                  : 'Start shopping to see your orders here'}
              </p>
              {hasActiveFilters ? (
                <Button onClick={clearFilters}>Clear Filters</Button>
              ) : (
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link href="/services">Browse Services</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
