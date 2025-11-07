/**
 * Leaflet Map Utility Functions
 * Using free services: OpenStreetMap Nominatim for geocoding
 */

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Geocode an address to coordinates using Nominatim
 */
export const geocodeAddress = async (address: string): Promise<Location> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'CarWashApp/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('Address not found');
    }

    const result = data[0];
    return {
      address: result.display_name || address,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to geocode address');
  }
};

/**
 * Reverse geocode coordinates to address using Nominatim
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CarWashApp/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      throw new Error('Address not found for coordinates');
    }

    return data.display_name;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reverse geocode');
  }
};

/**
 * Get current geolocation using browser API
 */
export const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'));
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
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information unavailable.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Calculate distance between two points (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
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

