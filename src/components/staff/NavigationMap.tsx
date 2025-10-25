'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Map } from 'lucide-react';

interface NavigationMapProps {
  address: string;
  customerPhone: string;
  latitude?: number;
  longitude?: number;
}

export function NavigationMap({
  address,
  customerPhone,
  latitude,
  longitude,
}: NavigationMapProps) {
  const openGoogleMaps = () => {
    if (latitude && longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        '_blank'
      );
    }
  };

  const callCustomer = () => {
    window.location.href = `tel:${customerPhone}`;
  };

  return (
    <Card className="border-2 sticky top-24">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="p-4 bg-muted rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={openGoogleMaps} 
            className="w-full shadow-md" 
            size="lg"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Navigate with Maps
          </Button>
          <Button
            onClick={callCustomer}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Customer
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl overflow-hidden border-2 border-border">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Map className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-sm text-muted-foreground">Map Preview</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>Tip:</strong> Click navigate to get turn-by-turn directions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
