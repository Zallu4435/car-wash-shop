'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  ArrowRight,
  Star,
  Layers,
  Bike
} from 'lucide-react';
import { useVehicleBrands, useVehicleModels } from '@/api/domains/admin-vehicles/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { AdminRoutes } from '@/lib/constants/routes';
import { StatCard } from '@/components/admin/StatCard';

export default function VehiclesHomePage() {
  const router = useRouter();
  const { data: brands, isLoading: brandsLoading, error: brandsError, refetch: refetchBrands } = useVehicleBrands();
  const { data: models, isLoading: modelsLoading, error: modelsError, refetch: refetchModels } = useVehicleModels();

  if (brandsLoading || modelsLoading) {
    return <Loading text="Loading vehicle data..." />;
  }

  if (brandsError || modelsError) {
    return (
      <Error 
        message="Failed to load vehicle data" 
        details={((brandsError || modelsError) as any)?.message}
        onRetry={() => {
          refetchBrands();
          refetchModels();
        }}
      />
    );
  }

  const vehicleSections = [
    {
      title: 'Vehicle Types',
      description: 'Manage vehicle categories (4-Wheeler, 2-Wheeler)',
      icon: Layers,
      count: 2,
      href: AdminRoutes.VEHICLE_TYPES,
    },
    {
      title: 'Body Types',
      description: 'Manage body types (Sedan, SUV, Hatchback, Bike, Scooty)',
      icon: Car,
      count: 8,
      href: AdminRoutes.VEHICLE_BODY_TYPES,
    },
    {
      title: 'Vehicle Models',
      description: 'Manage specific vehicle models',
      icon: Car,
      count: models?.length || 0,
      href: AdminRoutes.VEHICLE_MODELS_PAGE,
    },
  ];

  const stats = [
    {
      title: 'Brands',
      value: brands?.length || 0,
      icon: Star,
      subtext: 'Total brands'
    },
    {
      title: 'Models',
      value: models?.length || 0,
      icon: Car,
      subtext: 'Total models'
    },
    {
      title: 'Active Models',
      value: models?.filter((m: any) => m.status === 'active').length || 0,
      icon: Car,
      subtext: 'Active'
    },
    {
      title: 'Inactive Models',
      value: models?.filter((m: any) => m.status === 'inactive').length || 0,
      icon: Layers,
      subtext: 'Inactive'
    },
  ];

  const popularVehicles = models?.slice(0, 5) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Vehicle Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage vehicle types, body types, and specific models
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Car}
          label="Types"
          value={2}
          change="+3.5%"
          trend="up"
          description="Total brands"
        />
        
        <StatCard
          icon={Car}
          label="Models"
          value={models?.length || 0}
          change="+7.2%"
          trend="up"
          description="Total models"
        />
        
        <StatCard
          icon={Car}
          label="Active Models"
          value={models?.filter((m: any) => m.status === 'active').length || 0}
          valueClassName="text-primary"
          change="+9.1%"
          trend="up"
          description="Active"
        />
        
        <StatCard
          icon={Layers}
          label="Inactive Models"
          value={models?.filter((m: any) => m.status === 'inactive').length || 0}
          change="-1.5%"
          trend="down"
          description="Inactive"
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {vehicleSections.map((section) => (
          <Card 
            key={section.title} 
            className="border-2 border-border rounded-lg sm:rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => router.push(section.href)}
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-xl">
                  <section.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                {section.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{section.count}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Vehicles */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Popular Vehicles</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push(AdminRoutes.VEHICLE_MODELS_PAGE)} className="text-xs sm:text-sm h-8 sm:h-9 flex-shrink-0 border-2">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5 sm:space-y-3">
            {popularVehicles.map((vehicle: any, index: number) => (
              <div key={vehicle.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                      <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {vehicle.name}
                      </p>
                      <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
                      {vehicle.brandName} · {vehicle.type}
                    </p>
                  </div>
                </div>
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                  {vehicle.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-2 border-border rounded-lg sm:rounded-xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-1.5 sm:gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              Vehicle Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {brands?.slice(0, 4).map((brand: any) => (
                <div key={brand.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground">{brand.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{brand.modelCount} models</p>
                  </div>
                  <Badge variant={brand.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                    {brand.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border rounded-lg sm:rounded-xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-1.5 sm:gap-2">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              Model Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: 'Sedan', count: models?.filter((m: any) => m.type === 'sedan').length || 0 },
                { name: 'Hatchback', count: models?.filter((m: any) => m.type === 'hatchback').length || 0 },
                { name: 'SUV', count: models?.filter((m: any) => m.type === 'suv').length || 0 },
              ].map((type) => (
                <div key={type.name} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{type.count} models</p>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">{type.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
