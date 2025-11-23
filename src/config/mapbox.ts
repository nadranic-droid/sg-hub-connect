// Mapbox configuration
// Public token - can be safely committed to repository
// This should be your Mapbox public token from https://account.mapbox.com/
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Fallback message when token is not configured
export const MAPBOX_TOKEN_MISSING_MESSAGE = 'Map unavailable - Mapbox token required';
