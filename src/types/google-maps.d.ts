/**
 * Google Maps Type Declarations
 * Extends Window interface for Google Maps
 */

declare global {
  interface Window {
    google?: typeof google;
    gm_authFailure?: () => void;
  }
}

export {};
