'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Car, Calendar, Fuel, Gauge, TrendingUp, Users, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';

// Mock data - replace with actual API call
const vehicleModel = {
  id: 'model_001',
  name: 'Honda City',
  brand: 'Honda',
  bodyType: 'Sedan',
  vehicleType: '4-Wheeler',
  year: 2024,
  fuelType: 'Petrol',
  active: true,
  popular: true,
  image: '',
  bookings: 342,
  revenue: 171000,
  rating: 4.6,
  reviews: 89,
  customers: 256,
};

export default function VehicleModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deleteConfirmation = useConfirmation();

  const handleDeleteClick = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Vehicle Model?',
      description: 'This will permanently delete this vehicle model and all associated data. Customer vehicles using this model will need to be updated. This action cannot be undone.',
      confirmText: 'Yes, Delete Model',
      cancelText: 'Cancel',
      itemName: vehicleModel.name,
    });

    if (confirmed) {
      // TODO: Implement delete vehicle model API
      toast.success(`Vehicle model "${vehicleModel.name}" has been deleted`);
      router.push(AdminRoutes.VEHICLE_MODELS);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.VEHICLE_MODELS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Models
        </Button>
        <Button onClick={() => router.push(AdminRoutes.VEHICLE_MODEL_EDIT(id))} className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Model
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Model Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Info */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4 sm:space-y-5">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Vehicle Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-primary/20 mx-auto sm:mx-0">
                    <Car className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4 mb-2 sm:mb-3">
                      <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">{vehicleModel.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{vehicleModel.brand}</Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{vehicleModel.bodyType}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 flex-shrink-0">
                        <Badge variant={vehicleModel.active ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                          {vehicleModel.active ? 'Active' : 'Inactive'}
                        </Badge>
                        {vehicleModel.popular && (
                          <Badge variant="default" className="text-[10px] sm:text-xs bg-orange-500 hover:bg-orange-600">
                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                      {vehicleModel.vehicleType} • {vehicleModel.year} Model
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Year</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{vehicleModel.year}</p>
                  </div>
                  <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Fuel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Fuel Type</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground capitalize">{vehicleModel.fuelType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
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
                    <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Bookings</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{vehicleModel.bookings}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">₹{vehicleModel.revenue.toLocaleString()}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Customers</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{vehicleModel.customers}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Rating</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">⭐ {vehicleModel.rating}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5">{vehicleModel.reviews} reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <div className="p-2.5 sm:p-3 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-0.5 sm:mb-1">Avg Revenue per Booking</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">₹{Math.round(vehicleModel.revenue / vehicleModel.bookings)}</p>
              </div>

              <Separator />

              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-xs md:text-sm">
                  <span className="text-muted-foreground">Vehicle Type</span>
                  <span className="font-semibold text-foreground flex-shrink-0 text-right">{vehicleModel.vehicleType}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-xs md:text-sm">
                  <span className="text-muted-foreground">Body Type</span>
                  <span className="font-semibold text-foreground flex-shrink-0 text-right">{vehicleModel.bodyType}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-xs md:text-sm">
                  <span className="text-muted-foreground">Popularity</span>
                  <span className={`font-semibold flex-shrink-0 text-right ${vehicleModel.popular ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}>
                    {vehicleModel.popular ? 'High' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-xs md:text-sm">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0 text-right">
                    {Math.round((vehicleModel.rating / 5) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this vehicle model"
            actions={[
              {
                title: 'Delete Model',
                description: 'Permanently remove this vehicle model from the system',
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
