import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, MAPBOX_TOKEN_MISSING_MESSAGE } from "@/config/mapbox";

interface NeighbourhoodMapProps {
  latitude?: number;
  longitude?: number;
  businesses?: Array<{
    id: string;
    name: string;
    slug?: string;
    address?: string;
    phone?: string;
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [localToken, setLocalToken] = useState<string>("");

  useEffect(() => {
    if (!mapContainer.current) return;

    const effectiveToken = MAPBOX_TOKEN || localToken;

    if (!effectiveToken) {
      console.warn("Mapbox token not found. Map will not be displayed.");
      return;
    }

    mapboxgl.accessToken = effectiveToken;

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

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for businesses with enhanced popups
    const validBusinesses = businesses.filter((b) => b.latitude && b.longitude);
    
    validBusinesses.forEach((business) => {
      if (map.current) {
        // Create enhanced popup HTML
        const popupHTML = `
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #111;">${business.name}</h3>
            ${business.address ? `<p style="font-size: 13px; color: #666; margin-bottom: 6px; line-height: 1.4;">
              <strong>📍</strong> ${business.address}
            </p>` : ''}
            ${business.phone ? `<p style="font-size: 13px; color: #666; margin-bottom: 8px;">
              <strong>📞</strong> <a href="tel:${business.phone}" style="color: #006B4F; text-decoration: none;">${business.phone}</a>
            </p>` : ''}
            ${business.slug ? `<a href="/business/${business.slug}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #006B4F; color: white; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">View Details →</a>` : ''}
          </div>
        `;

        const marker = new mapboxgl.Marker({ color: "#006B4F" })
          .setLngLat([business.longitude, business.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25, maxWidth: "300px" })
              .setHTML(popupHTML)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });

    // Auto-zoom to fit all businesses if there are any
    if (validBusinesses.length > 0 && map.current) {
      map.current.once("load", () => {
        if (validBusinesses.length === 1) {
          // If only one business, center on it with a reasonable zoom
          map.current?.setCenter([validBusinesses[0].longitude, validBusinesses[0].latitude]);
          map.current?.setZoom(15);
        } else {
          // Fit bounds to show all businesses
          const bounds = new mapboxgl.LngLatBounds();
          validBusinesses.forEach((business) => {
            bounds.extend([business.longitude, business.latitude]);
          });
          map.current?.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 16,
          });
        }
      });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [latitude, longitude, businesses]);

  return (
    <div className="relative w-full h-[250px] rounded-xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      {!(MAPBOX_TOKEN || localToken) && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {MAPBOX_TOKEN_MISSING_MESSAGE}
            </p>
            <p className="text-xs text-muted-foreground">
              Paste a temporary Mapbox public token below to preview the map.
            </p>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
              placeholder="pk.ey... your Mapbox public token"
              onChange={(e) => setLocalToken(e.target.value.trim())}
            />
          </div>
        </div>
      )}
      {businesses.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-muted-foreground border border-border/50">
          📍 Click markers for details • 🔍 Zoom to explore
        </div>
      )}
    </div>
  );
};
