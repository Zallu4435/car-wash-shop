'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, ExternalLink } from 'lucide-react';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  height?: string;
}

// Default center (Mumbai, India)
const DEFAULT_CENTER: [number, number] = [19.0760, 72.8777];
const DEFAULT_ZOOM = 13;

export function LocationMap({ 
  latitude, 
  longitude, 
  address,
  height = '400px'
}: LocationMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Small delay to ensure Leaflet CSS is loaded
      const timer = setTimeout(() => {
        setIsMapReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  const position: [number, number] = [latitude, longitude];

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isClient) {
    return (
      <Card className="border-2 border-border">
        <CardContent className="p-4 flex items-center justify-center" style={{ height }}>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="relative" style={{ height }}>
          {!isMapReady ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <MapContainer
              center={position}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                {address && (
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {latitude.toFixed(6)}, {longitude.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                )}
              </Marker>
            </MapContainer>
          )}
          
          {/* Google Maps Button */}
          <div className="absolute top-4 right-4 z-[1000]">
            <button
              onClick={openGoogleMaps}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 shadow-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
              title="Open in Google Maps"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in Google Maps</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

