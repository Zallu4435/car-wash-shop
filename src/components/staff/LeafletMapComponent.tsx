'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface LeafletMapComponentProps {
  latitude: number;
  longitude: number;
  address: string;
}

export function LeafletMapComponent({
  latitude,
  longitude,
  address,
}: LeafletMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !latitude || !longitude) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
      attributionControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      }),
    }).addTo(map);

    // Add popup with address
    marker.bindPopup(`<div class="text-xs sm:text-sm"><strong>Service Location</strong><br/>${address}</div>`).openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [latitude, longitude, address]); // Initialize when coordinates are available

  // Update marker position if coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current && latitude && longitude) {
      const newLatLng = L.latLng(latitude, longitude);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, mapRef.current.getZoom());
      
      // Update popup
      markerRef.current.setPopupContent(`<div class="text-xs sm:text-sm"><strong>Service Location</strong><br/>${address}</div>`);
    }
  }, [latitude, longitude, address]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg sm:rounded-xl"
      style={{ minHeight: '192px' }}
    />
  );
}

