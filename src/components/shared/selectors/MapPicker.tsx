'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Navigation } from 'lucide-react';

interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
}

export function MapPicker({ onLocationSelect, initialAddress = '' }: MapPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    // Simulate search - in production, use Google Places API
    setTimeout(() => {
      onLocationSelect({ address });
      setSearching(false);
    }, 500);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            address: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span>Select Location</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!address || searching}
              className="h-10 sm:h-11 text-xs sm:text-sm w-full sm:w-auto px-4 sm:px-6"
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-10 sm:h-11 text-xs sm:text-sm"
          onClick={getCurrentLocation}
        >
          <Navigation className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Use Current Location
        </Button>

        {/* Map placeholder */}
        <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-muted to-muted/50 rounded-lg sm:rounded-xl border-2 border-border flex items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-background rounded-full mb-2 sm:mb-3">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-0.5 sm:mb-1">
              Map will display selected location
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Interactive map integration coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
