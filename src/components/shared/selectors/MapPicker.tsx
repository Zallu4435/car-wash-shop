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
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Location
          </h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={!address || searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={getCurrentLocation}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Use Current Location
        </Button>

        {/* Map placeholder */}
        <div className="h-64 bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 border-border flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full mb-3">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Map will display selected location
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Interactive map integration coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
