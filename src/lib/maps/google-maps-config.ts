/**
 * Google Maps Configuration
 * Centralized configuration for Google Maps
 */

export const GOOGLE_MAPS_CONFIG = {
  // Default map center (Bangalore, India)
  defaultCenter: {
    lat: 12.9716,
    lng: 77.5946,
  },

  // Default zoom level
  defaultZoom: 15,

  // Map options
  mapOptions: {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    gestureHandling: 'greedy',
  },

  // Marker options
  markerOptions: {
    draggable: true,
  },

  // Autocomplete options
  autocompleteOptions: {
    componentRestrictions: { country: 'in' },
    fields: ['formatted_address', 'geometry', 'name'] as string[],
  },

  // Geocoder options
  geocoderOptions: {
    region: 'IN',
  },

  // Geolocation options
  geolocationOptions: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  },
} as const;

/**
 * Map style presets
 */
export const MAP_STYLES = {
  default: [],
  
  // Minimal style
  minimal: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],

  // Dark mode style
  dark: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  ],
} as const;

/**
 * Error messages
 */
export const MAP_ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Location permission denied. Please enable location access in your browser.',
  POSITION_UNAVAILABLE: 'Location information unavailable. Please try again.',
  TIMEOUT: 'Location request timed out. Please try again.',
  UNKNOWN: 'Unable to get location. Please search for your address instead.',
  GEOCODE_FAILED: 'Failed to find address. Please try a different search.',
  MAP_LOAD_FAILED: 'Failed to load map. Please check your internet connection.',
  API_KEY_MISSING: 'Google Maps API key not configured.',
  BILLING_NOT_ENABLED: 'Google Maps billing not enabled. Please enable billing in Google Cloud Console.',
} as const;
