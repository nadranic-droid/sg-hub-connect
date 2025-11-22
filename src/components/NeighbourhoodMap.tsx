import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface NeighbourhoodMapProps {
  latitude?: number;
  longitude?: number;
  businesses?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

export const NeighbourhoodMap = ({
  latitude = 1.3521,
  longitude = 103.8198,
  businesses = [],
}: NeighbourhoodMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.warn("Mapbox token not found. Map will not be displayed.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: 13,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add markers for businesses
    businesses.forEach((business) => {
      if (business.latitude && business.longitude && map.current) {
        new mapboxgl.Marker({ color: "#006B4F" })
          .setLngLat([business.longitude, business.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 class="font-semibold">${business.name}</h3>`
            )
          )
          .addTo(map.current);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, businesses]);

  return (
    <div className="relative w-full h-[250px] rounded-xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      {!import.meta.env.VITE_MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">
              Map unavailable - Mapbox token required
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
