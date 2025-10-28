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

export default function VehiclesHomePage() {
  const router = useRouter();

  const vehicleSections = [
    {
      title: 'Vehicle Types',
      description: 'Manage vehicle categories (4-Wheeler, 2-Wheeler)',
      icon: Layers,
      count: 2,
      href: '/admin/vehicles/types',
    },
    {
      title: 'Body Types',
      description: 'Manage body types (Sedan, SUV, Hatchback, Bike, Scooty)',
      icon: Car,
      count: 8,
      href: '/admin/vehicles/body-types',
    },
    {
      title: 'Vehicles',
      description: 'Manage specific vehicle models',
      icon: Car,
      count: 45,
      href: '/admin/vehicles/models',
    },
  ];

  const stats = [
    {
      title: 'Vehicle Types',
      value: '2',
      icon: Layers,
      subtext: '4W, 2W'
    },
    {
      title: 'Body Types',
      value: '8',
      icon: Car,
      subtext: 'All categories'
    },
    {
      title: 'Total Vehicles',
      value: '45',
      icon: Car,
      subtext: 'All models'
    },
    {
      title: 'Popular Models',
      value: '12',
      icon: Star,
      subtext: 'Most booked'
    },
  ];

  const popularVehicles = [
    { name: 'Swift Dzire', bodyType: 'Sedan', type: '4-Wheeler', bookings: 245 },
    { name: 'Tata Nexon', bodyType: 'SUV', type: '4-Wheeler', bookings: 189 },
    { name: 'Honda Activa', bodyType: 'Scooty', type: '2-Wheeler', bookings: 156 },
    { name: 'Royal Enfield Classic', bodyType: 'Bike', type: '2-Wheeler', bookings: 134 },
    { name: 'Maruti Alto', bodyType: 'Hatchback', type: '4-Wheeler', bookings: 112 },
  ];

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate flex-1">{stat.title}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {vehicleSections.map((section) => (
          <Card 
            key={section.title} 
            className="border-2 border-border hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
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
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg truncate">Popular Vehicles</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/vehicles/models')} className="text-xs sm:text-sm h-8 sm:h-9 flex-shrink-0">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5 sm:space-y-3">
            {popularVehicles.map((vehicle, index) => (
              <div key={vehicle.name} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                      <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {vehicle.name}
                      </p>
                      {vehicle.type === '2-Wheeler' && (
                        <Bike className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      {vehicle.type === '4-Wheeler' && (
                        <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {vehicle.bodyType} · {vehicle.type} · {vehicle.bookings} bookings
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex-shrink-0">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  <span className="hidden xs:inline">Popular</span>
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              4-Wheeler Body Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: 'Sedan', count: 12, example: 'Swift Dzire, Honda City' },
                { name: 'SUV', count: 10, example: 'Tata Nexon, Hyundai Creta' },
                { name: 'Hatchback', count: 8, example: 'Maruti Alto, Hyundai i20' },
                { name: 'Luxury', count: 5, example: 'BMW 3 Series, Audi A4' },
              ].map((type) => (
                <div key={type.name} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{type.example}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">{type.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Bike className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              2-Wheeler Body Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: 'Bike', count: 6, example: 'Royal Enfield, Pulsar' },
                { name: 'Scooty', count: 4, example: 'Honda Activa, TVS Jupiter' },
              ].map((type) => (
                <div key={type.name} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{type.example}</p>
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
