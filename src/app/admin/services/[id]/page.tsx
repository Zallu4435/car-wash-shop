'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Car, Clock, IndianRupee, TrendingUp, Calendar, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';

const service = {
  id: 'svc_001',
  name: 'Premium Wash',
  category: 'Exterior Wash',
  description: 'Complete exterior wash with foam, high-pressure rinse, and tire cleaning. Includes wheel cleaning and tire shine for a complete finish.',
  price: 499,
  duration: 30,
  active: true,
  bookings: 156,
  revenue: 77844,
  rating: 4.8,
  reviews: 45,
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deleteConfirmation = useConfirmation();

  const handleDeleteClick = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Service?',
      description: 'This will permanently delete this service and all associated data. Customers will no longer be able to book this service. This action cannot be undone.',
      confirmText: 'Yes, Delete Service',
      cancelText: 'Cancel',
      itemName: service.name,
    });

    if (confirmed) {
      // TODO: Implement delete service API
      toast.success(`Service "${service.name}" has been deleted`);
      router.push('/admin/services');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/services')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
        <Button onClick={() => router.push(`/admin/services/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Service Icon */}
                <div className="w-32 h-32 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                  <Car className="h-16 w-16 text-primary" />
                </div>

                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{service.name}</h1>
                      <Badge variant="outline" className="text-xs">{service.category}</Badge>
                    </div>
                    <Badge variant={service.active ? 'default' : 'secondary'}>
                      {service.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4">{service.description}</p>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Price</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">₹{service.price}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{service.duration} min</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Performance Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bookings</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{service.bookings}</p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <p className="text-xs text-green-900 dark:text-green-100 uppercase tracking-wide">Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">₹{service.revenue.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Reviews</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{service.reviews}</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Rating</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">⭐ {service.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Avg Revenue per Booking</p>
                <p className="text-3xl font-bold text-primary">₹{service.price}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-foreground">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">96%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repeat Customers</span>
                  <span className="font-semibold text-foreground">64%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this service"
            actions={[
              {
                title: 'Delete Service',
                description: 'Permanently remove this service from the system',
                buttonText: 'Delete',
                buttonIcon: Trash2,
                onClick: handleDeleteClick,
              },
            ]}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
