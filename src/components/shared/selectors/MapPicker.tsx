'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  geocodeAddress, 
  reverseGeocode, 
  getCurrentPosition,
  type Location 
} from '@/lib/maps/leaflet-utils';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
  initialLatitude?: number;
  initialLongitude?: number;
}

// Default center (Mumbai, India)
const DEFAULT_CENTER: [number, number] = [19.0760, 72.8777];
const DEFAULT_ZOOM = 13;

export function MapPicker({ 
  onLocationSelect, 
  initialAddress = '',
  initialLatitude,
  initialLongitude,
}: MapPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [searching, setSearching] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLatitude && initialLongitude 
      ? [initialLatitude, initialLongitude]
      : null
  );
  const [isClient, setIsClient] = useState(false);
  
  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    if (initialLatitude && initialLongitude) {
      setIsMapReady(true);
    }
  }, [initialLatitude, initialLongitude]);

  const handleLocationChange = useCallback(async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    try {
      const addressText = await reverseGeocode(lat, lng);
      setAddress(addressText);
      onLocationSelect({ address: addressText, latitude: lat, longitude: lng });
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      onLocationSelect({ address: '', latitude: lat, longitude: lng });
    }
  }, [onLocationSelect]);

  const handleMapClick = useCallback((e: any) => {
    const { lat, lng } = e.latlng;
    handleLocationChange(lat, lng);
  }, [handleLocationChange]);

  const handleSearch = async () => {
    if (!address.trim()) return;

    setSearching(true);
    
    try {
      const location = await geocodeAddress(address);
      
      setMarkerPosition([location.latitude, location.longitude]);
      setAddress(location.address);
      onLocationSelect(location);
    } catch (error: any) {
      toast.error(error.message || 'Location not found');
    } finally {
      setSearching(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    toast.loading('Getting your location...');

    try {
      const position = await getCurrentPosition();
      
      setMarkerPosition([position.lat, position.lng]);
      setIsMapReady(true);
      
      const addressText = await reverseGeocode(position.lat, position.lng);
      setAddress(addressText);
      
      onLocationSelect({ address: addressText, latitude: position.lat, longitude: position.lng });
      
      toast.dismiss();
      toast.success('Location detected');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  // Set initial position when provided
  useEffect(() => {
    if (initialLatitude && initialLongitude && !markerPosition) {
      setMarkerPosition([initialLatitude, initialLongitude]);
      setIsMapReady(true);
    }
  }, [initialLatitude, initialLongitude, markerPosition]);

  const currentCenter = markerPosition || DEFAULT_CENTER;

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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none" />
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
              disabled={!address.trim() || searching}
              className="h-10 sm:h-11 text-xs sm:text-sm w-full sm:w-auto px-4 sm:px-6"
            >
              {searching ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-10 sm:h-11 text-xs sm:text-sm"
          onClick={handleGetCurrentLocation}
        >
          <Navigation className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Use Current Location
        </Button>

        {/* Leaflet Map */}
        <div className="h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl border-2 border-border overflow-hidden relative">
          {!isClient ? (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center z-10">
              <div className="text-center px-4">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-spin mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Loading map...
                </p>
              </div>
            </div>
          ) : (
            <>
              <MapContainer
                center={currentCenter}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
                eventHandlers={{
                  click: handleMapClick,
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerPosition && (
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e: any) => {
                        const { lat, lng } = e.target.getLatLng();
                        handleLocationChange(lat, lng);
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">Selected Location</p>
                        <p className="text-xs text-muted-foreground mt-1">{address || 'Drag to adjust'}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </>
          )}
        </div>

        {markerPosition && (
          <div className="p-3 bg-muted rounded-lg text-xs sm:text-sm">
            <p className="text-muted-foreground mb-1">Selected Location:</p>
            <p className="font-medium text-foreground">{address || 'Fetching address...'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Lat: {markerPosition[0].toFixed(6)}, Lng: {markerPosition[1].toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
