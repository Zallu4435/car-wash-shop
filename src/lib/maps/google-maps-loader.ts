/**
 * Google Maps Script Loader
 * Handles loading Google Maps API script dynamically
 */

/// <reference types="google.maps" />

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

let isLoading = false;
let isLoaded = false;

/**
 * Load Google Maps script dynamically
 * Ensures script is only loaded once
 */
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if API key exists
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not found');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Check if already loaded
    if (window.google?.maps) {
      isLoaded = true;
      resolve();
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      // Script exists, wait for it to load
      if (isLoaded) {
        resolve();
      } else {
        // Wait for loading to complete
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            isLoaded = true;
            isLoading = false;
            resolve();
          }
        }, 100);
      }
      return;
    }

    // Prevent multiple simultaneous loads
    if (isLoading) {
      const checkInterval = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    // Load the script
    isLoading = true;
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Check if Google Maps is loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return Boolean(window.google?.maps);
};

/**
 * Get Google Maps API key
 */
export const getGoogleMapsApiKey = (): string => {
  return GOOGLE_MAPS_API_KEY;
};
