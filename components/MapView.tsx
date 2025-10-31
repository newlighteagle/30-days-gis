"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  geojson?: any;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({
  geojson,
  center = [0, 0],
  zoom = 2,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // 1️⃣ Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center,
      zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, [center, zoom]);

  // 2️⃣ Update GeoJSON dynamically
  useEffect(() => {
    if (!map.current || !geojson) return;

    const mapInstance = map.current;

    mapInstance.once("load", () => {
      if (!mapInstance.getSource("geojson-data")) {
        mapInstance.addSource("geojson-data", {
          type: "geojson",
          data: geojson,
        });
      } else {
        (
          mapInstance.getSource("geojson-data") as maplibregl.GeoJSONSource
        ).setData(geojson);
      }

      const geometryType = geojson.features?.[0]?.geometry?.type;

      const hasLayer = (id: string) => mapInstance.getLayer(id);

      if (geometryType === "Point" || geometryType === "MultiPoint") {
        if (!hasLayer("points")) {
          mapInstance.addLayer({
            id: "points",
            type: "circle",
            source: "geojson-data",
            paint: {
              "circle-radius": 6,
              "circle-color": "#3b82f6",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });
        }
      } else if (
        geometryType === "LineString" ||
        geometryType === "MultiLineString"
      ) {
        if (!hasLayer("lines")) {
          mapInstance.addLayer({
            id: "lines",
            type: "line",
            source: "geojson-data",
            paint: {
              "line-color": "#3b82f6",
              "line-width": 3,
            },
          });
        }
      } else if (
        geometryType === "Polygon" ||
        geometryType === "MultiPolygon"
      ) {
        if (!hasLayer("polygons-fill")) {
          mapInstance.addLayer({
            id: "polygons-fill",
            type: "fill",
            source: "geojson-data",
            paint: {
              "fill-color": "#3b82f6",
              "fill-opacity": 0.5,
            },
          });
        }
        if (!hasLayer("polygons-outline")) {
          mapInstance.addLayer({
            id: "polygons-outline",
            type: "line",
            source: "geojson-data",
            paint: {
              "line-color": "#1e40af",
              "line-width": 2,
            },
          });
        }
      }

      // Fit bounds
      const bounds = new maplibregl.LngLatBounds();
      geojson.features.forEach((f: any) => {
        if (f.geometry.type === "Point") bounds.extend(f.geometry.coordinates);
        else if (f.geometry.coordinates) {
          const coords = f.geometry.coordinates
            .flat(Infinity)
            .filter((c: any) => Array.isArray(c));
          coords.forEach((c: any) => bounds.extend(c));
        }
      });

      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds, { padding: 50 });
      }
    });
  }, [geojson]);

  return <div ref={mapContainer} className="w-full h-full rounded-xl shadow" />;
}
