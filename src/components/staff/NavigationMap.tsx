'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { geocodeAddress } from '@/lib/maps/leaflet-utils';

// Dynamically import Leaflet map component to avoid SSR issues
const LeafletMap = dynamic(
  () => import('./LeafletMapComponent').then((mod) => mod.LeafletMapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl bg-muted animate-pulse flex items-center justify-center">
        <p className="text-xs sm:text-sm text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

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
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Geocode address if coordinates are not provided
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (latitude && longitude) {
        setMapCoords({ lat: latitude, lng: longitude });
        return;
      }

      if (!address) return;

      setIsGeocoding(true);
      try {
        const location = await geocodeAddress(address);
        setMapCoords({ lat: location.latitude, lng: location.longitude });
      } catch (error) {
        console.error('Failed to geocode address:', error);
        // If geocoding fails, we'll just show the address without map
      } finally {
        setIsGeocoding(false);
      }
    };

    fetchCoordinates();
  }, [address, latitude, longitude]);

  const openGoogleMaps = () => {
    if (mapCoords) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${mapCoords.lat},${mapCoords.lng}`,
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
    if (customerPhone) {
      window.location.href = `tel:${customerPhone}`;
    }
  };

  return (
    <Card className="border-2 border-border sticky top-24">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <CardTitle className="text-sm sm:text-base lg:text-lg">Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* OpenStreetMap with Leaflet */}
        <div className="relative h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border">
          {isGeocoding ? (
            <div className="h-full bg-muted animate-pulse flex items-center justify-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Loading map...</p>
            </div>
          ) : mapCoords ? (
            <LeafletMap
              latitude={mapCoords.lat}
              longitude={mapCoords.lng}
              address={address}
            />
          ) : (
            <div className="h-full bg-muted flex items-center justify-center">
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
                Map unavailable. Address: {address}
              </p>
            </div>
          )}
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
            Navigate with Google Maps
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
            <strong className="text-foreground">Tip:</strong> Click navigate to get turn-by-turn directions in Google Maps
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
