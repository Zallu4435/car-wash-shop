'use client';

/// <reference types="google.maps" />

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  loadGoogleMapsScript, 
  GOOGLE_MAPS_CONFIG, 
  geocodeAddress, 
  reverseGeocode as reverseGeocodeUtil, 
  getCurrentPosition,
  type Location 
} from '@/lib/maps';

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
  initialLatitude?: number;
  initialLongitude?: number;
}

export function MapPicker({ 
  onLocationSelect, 
  initialAddress = '',
  initialLatitude,
  initialLongitude,
}: MapPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [searching, setSearching] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    initialLatitude && initialLongitude 
      ? { lat: initialLatitude, lng: initialLongitude }
      : null
  );
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps Script
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setIsMapLoaded(true);
        initializeMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        toast.error(error.message || 'Failed to load Google Maps');
      });
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const defaultCenter = markerPosition || GOOGLE_MAPS_CONFIG.defaultCenter;

    // Initialize map
    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
      ...GOOGLE_MAPS_CONFIG.mapOptions,
    });

    // Initialize marker
    markerRef.current = new google.maps.Marker({
      map: googleMapRef.current,
      position: defaultCenter,
      draggable: true,
    });

    // Add marker drag listener
    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current?.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        setMarkerPosition({ lat, lng });
        reverseGeocode(lat, lng);
      }
    });

    // Add map click listener
    googleMapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        markerRef.current?.setPosition({ lat, lng });
        reverseGeocode(lat, lng);
      }
    });

    // Initialize autocomplete
    if (inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        GOOGLE_MAPS_CONFIG.autocompleteOptions
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || '';
          
          setAddress(address);
          setMarkerPosition({ lat, lng });
          markerRef.current?.setPosition({ lat, lng });
          googleMapRef.current?.setCenter({ lat, lng });
          
          onLocationSelect({ address, latitude: lat, longitude: lng });
        }
      });
    }
  }, [markerPosition, onLocationSelect]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const address = await reverseGeocodeUtil(lat, lng);
      setAddress(address);
      onLocationSelect({ address, latitude: lat, longitude: lng });
    } catch (error) {
      console.error('Reverse geocode failed:', error);
    }
  };

  const handleSearch = async () => {
    if (!address) return;

    setSearching(true);
    
    try {
      const location = await geocodeAddress(address);
      
      setMarkerPosition({ lat: location.latitude, lng: location.longitude });
      markerRef.current?.setPosition({ lat: location.latitude, lng: location.longitude });
      googleMapRef.current?.setCenter({ lat: location.latitude, lng: location.longitude });
      
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
      
      setMarkerPosition(position);
      markerRef.current?.setPosition(position);
      googleMapRef.current?.setCenter(position);
      
      await reverseGeocode(position.lat, position.lng);
      
      toast.dismiss();
      toast.success('Location detected');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                placeholder="Search address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
                disabled={!isMapLoaded}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!address || searching || !isMapLoaded}
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
          disabled={!isMapLoaded}
        >
          <Navigation className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Use Current Location
        </Button>

        {/* Google Map */}
        <div className="h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl border-2 border-border overflow-hidden relative">
          {!isMapLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center z-10">
              <div className="text-center px-4">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-spin mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Loading map...
                </p>
              </div>
            </div>
          )}
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '200px' }}
          />
        </div>

        {markerPosition && (
          <div className="p-3 bg-muted rounded-lg text-xs sm:text-sm">
            <p className="text-muted-foreground mb-1">Selected Location:</p>
            <p className="font-medium text-foreground">{address || 'Fetching address...'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Lat: {markerPosition.lat.toFixed(6)}, Lng: {markerPosition.lng.toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
