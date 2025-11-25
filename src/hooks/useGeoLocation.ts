import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Singapore neighbourhoods with approximate coordinates
const SINGAPORE_NEIGHBOURHOODS = [
  { name: "Yishun", lat: 1.4294, lng: 103.8350 },
  { name: "Bugis", lat: 1.2996, lng: 103.8554 },
  { name: "Kampong Glam", lat: 1.3023, lng: 103.8598 },
  { name: "Geylang Serai", lat: 1.3186, lng: 103.8974 },
  { name: "Jurong East", lat: 1.3329, lng: 103.7436 },
  { name: "Orchard", lat: 1.3048, lng: 103.8318 },
  { name: "Marina Bay", lat: 1.2819, lng: 103.8608 },
  { name: "Tampines", lat: 1.3526, lng: 103.9445 },
  { name: "Woodlands", lat: 1.4360, lng: 103.7860 },
  { name: "Ang Mo Kio", lat: 1.3691, lng: 103.8454 },
  { name: "Bishan", lat: 1.3506, lng: 103.8484 },
  { name: "Toa Payoh", lat: 1.3325, lng: 103.8474 },
  { name: "Pasir Ris", lat: 1.3733, lng: 103.9494 },
  { name: "Punggol", lat: 1.4053, lng: 103.9029 },
  { name: "Sengkang", lat: 1.3886, lng: 103.8950 },
  { name: "Hougang", lat: 1.3612, lng: 103.8860 },
  { name: "Serangoon", lat: 1.3541, lng: 103.8728 },
  { name: "Clementi", lat: 1.3152, lng: 103.7644 },
  { name: "Queenstown", lat: 1.2965, lng: 103.8058 },
  { name: "Tiong Bahru", lat: 1.2856, lng: 103.8325 },
  { name: "Chinatown", lat: 1.2839, lng: 103.8436 },
  { name: "Little India", lat: 1.3064, lng: 103.8503 },
  { name: "Sentosa", lat: 1.2494, lng: 103.8303 },
  { name: "Changi", lat: 1.3644, lng: 103.9915 },
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest neighbourhood based on coordinates
function findNearestNeighbourhood(lat: number, lng: number): string {
  let nearest = SINGAPORE_NEIGHBOURHOODS[0];
  let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);

  for (const hood of SINGAPORE_NEIGHBOURHOODS) {
    const distance = calculateDistance(lat, lng, hood.lat, hood.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = hood;
    }
  }

  return nearest.name;
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestNeighbourhood, setNearestNeighbourhood] = useState<string>("Bugis"); // Default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    // Try to get location from localStorage first (cached)
    const cachedLocation = localStorage.getItem('user_location');
    const cachedNeighbourhood = localStorage.getItem('user_neighbourhood');
    
    if (cachedLocation && cachedNeighbourhood) {
      try {
        const { lat, lng } = JSON.parse(cachedLocation);
        setLocation({ latitude: lat, longitude: lng });
        setNearestNeighbourhood(cachedNeighbourhood);
        setLoading(false);
        // Still try to update in background
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Find nearest neighbourhood
        const neighbourhood = findNearestNeighbourhood(latitude, longitude);
        setNearestNeighbourhood(neighbourhood);

        // Cache the location
        localStorage.setItem('user_location', JSON.stringify({ lat: latitude, lng: longitude }));
        localStorage.setItem('user_neighbourhood', neighbourhood);

        // Also try to fetch from database if available
        try {
          const { data } = await supabase
            .from("neighbourhoods")
            .select("name, slug")
            .ilike("name", `%${neighbourhood}%`)
            .limit(1);

          if (data && data.length > 0) {
            setNearestNeighbourhood(data[0].name);
            localStorage.setItem('user_neighbourhood', data[0].name);
          }
        } catch {
          // Database lookup failed, use calculated neighbourhood
        }
        
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        
        // Try to use IP-based location as fallback
        fetchIPLocation();
        
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 3600000 // Cache for 1 hour
      }
    );
  }, []);

  // Fallback: Try to get approximate location from IP
  const fetchIPLocation = async () => {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const neighbourhood = findNearestNeighbourhood(data.latitude, data.longitude);
        setNearestNeighbourhood(neighbourhood);
        setLocation({ latitude: data.latitude, longitude: data.longitude });
        localStorage.setItem('user_location', JSON.stringify({ lat: data.latitude, lng: data.longitude }));
        localStorage.setItem('user_neighbourhood', neighbourhood);
      }
    } catch {
      // IP location fetch failed, keep default neighbourhood
    }
  };

  return { location, nearestNeighbourhood, loading, error };
};

