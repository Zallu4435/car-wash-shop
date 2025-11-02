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
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/services')} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Services
        </Button>
        <Button onClick={() => router.push(`/admin/services/${id}/edit`)} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Service
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Service Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Info */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4 sm:space-y-5">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Service Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-primary/20 mx-auto sm:mx-0">
                    <Car className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">{service.name}</h1>
                        <Badge variant="outline" className="text-xs sm:text-sm">{service.category}</Badge>
                      </div>
                      <Badge variant={service.active ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                        {service.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{service.description}</p>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Price</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">₹{service.price}</p>
                  </div>
                  <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Duration</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{service.duration} min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Performance Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Bookings</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{service.bookings}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">₹{service.revenue.toLocaleString()}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Reviews</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{service.reviews}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Rating</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">⭐ {service.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl xl:sticky xl:top-6 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Avg Revenue per Booking</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">₹{service.price}</p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-foreground flex-shrink-0">98%</span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">96%</span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Repeat Customers</span>
                  <span className="font-semibold text-foreground flex-shrink-0">64%</span>
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
