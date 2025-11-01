/**
 * Google Maps Utility Functions
 * Helper functions for geocoding, reverse geocoding, etc.
 */

/// <reference types="google.maps" />

import { GOOGLE_MAPS_CONFIG, MAP_ERROR_MESSAGES } from './google-maps-config';

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Geocode an address to coordinates
 */
export const geocodeAddress = (address: string): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { 
        address,
        ...GOOGLE_MAPS_CONFIG.geocoderOptions,
      },
      (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location;
          resolve({
            address: results[0].formatted_address,
            latitude: location.lat(),
            longitude: location.lng(),
          });
        } else {
          reject(new Error(MAP_ERROR_MESSAGES.GEOCODE_FAILED));
        }
      }
    );
  });
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = (lat: number, lng: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { 
        location: { lat, lng },
        ...GOOGLE_MAPS_CONFIG.geocoderOptions,
      },
      (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error('Failed to get address'));
        }
      }
    );
  });
};

/**
 * Get current geolocation
 */
export const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = MAP_ERROR_MESSAGES.UNKNOWN;
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = MAP_ERROR_MESSAGES.PERMISSION_DENIED;
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = MAP_ERROR_MESSAGES.POSITION_UNAVAILABLE;
            break;
          case 3: // TIMEOUT
            errorMessage = MAP_ERROR_MESSAGES.TIMEOUT;
            break;
        }
        
        reject(new Error(errorMessage));
      },
      GOOGLE_MAPS_CONFIG.geolocationOptions
    );
  });
};

/**
 * Calculate distance between two points (in kilometers)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  if (!window.google?.maps) {
    // Fallback to Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const point1 = new google.maps.LatLng(lat1, lng1);
  const point2 = new google.maps.LatLng(lat2, lng2);
  return google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};
