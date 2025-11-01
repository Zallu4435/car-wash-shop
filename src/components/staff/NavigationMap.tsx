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

  const mapUrl = latitude && longitude
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&zoom=15`;

  return (
    <Card className="border-2 border-border sticky top-24">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <CardTitle className="text-sm sm:text-base lg:text-lg">Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Google Map Embed */}
        <div className="relative h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        {/* Address */}
        <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Address</p>
          </div>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={openGoogleMaps} 
            className="w-full shadow-md h-10 sm:h-11 text-xs sm:text-sm border-2" 
            size="lg"
          >
            <Navigation className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Navigate with Maps
          </Button>
          {customerPhone && (
            <Button
              onClick={callCustomer}
              variant="outline"
              className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2"
              size="lg"
            >
              <Phone className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Call Customer
            </Button>
          )}
        </div>

        {/* Quick Info */}
        <div className="p-2.5 sm:p-3 bg-primary/5 rounded-lg sm:rounded-xl border border-primary/20">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Click navigate to get turn-by-turn directions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
