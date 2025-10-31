"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  geojson: GeoJSON.FeatureCollection;
  center?: [number, number];
  zoom?: number;
};

export default function MapView({
  geojson,
  center = [101.5, 0.5],
  zoom = 8,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    // Jika belum ada container, jangan lanjut
    if (!mapContainer.current) return;

    // ✅ Bersihkan map sebelumnya hanya kalau sudah ada instance valid
    if (mapRef.current && mapRef.current.remove) {
      try {
        mapRef.current.remove();
      } catch (err) {
        console.warn("Map cleanup skipped:", err);
      }
      mapRef.current = null;
    }

    // Buat instance baru MapLibre
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center,
      zoom,
    });
    mapRef.current = map;

    map.on("load", () => {
      if (!geojson || !geojson.features?.length) {
        console.warn("GeoJSON kosong");
        return;
      }

      map.addSource("challenge-data", {
        type: "geojson",
        data: geojson,
      });

      const geomType = geojson.features[0]?.geometry?.type;
      console.log("Detected geometry:", geomType);

      // Tambahkan layer sesuai tipe geometry
      if (geomType === "Point" || geomType === "MultiPoint") {
        map.addLayer({
          id: "points-layer",
          type: "circle",
          source: "challenge-data",
          paint: {
            "circle-radius": 6,
            "circle-color": "#FF3B3B",
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2,
          },
        });
      } else if (geomType === "LineString" || geomType === "MultiLineString") {
        map.addLayer({
          id: "lines-layer",
          type: "line",
          source: "challenge-data",
          paint: {
            "line-color": "#1D4ED8",
            "line-width": 3,
          },
        });
      } else if (geomType === "Polygon" || geomType === "MultiPolygon") {
        map.addLayer({
          id: "fill-layer",
          type: "fill",
          source: "challenge-data",
          paint: {
            "fill-color": "#3B82F6",
            "fill-opacity": 0.4,
          },
        });
        map.addLayer({
          id: "outline-layer",
          type: "line",
          source: "challenge-data",
          paint: {
            "line-color": "#1D4ED8",
            "line-width": 2,
          },
        });
      }

      // Auto fit ke semua fitur
      const bounds = new maplibregl.LngLatBounds();
      geojson.features.forEach((f) => {
        if (f.geometry.type === "Point") {
          bounds.extend(f.geometry.coordinates as [number, number]);
        } else if (f.geometry.type === "LineString") {
          (f.geometry.coordinates as [number, number][]).forEach((c) =>
            bounds.extend(c)
          );
        } else if (f.geometry.type === "Polygon") {
          (f.geometry.coordinates[0] as [number, number][]).forEach((c) =>
            bounds.extend(c)
          );
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, duration: 500 });
      }
    });

    // ✅ Cleanup aman
    return () => {
      if (mapRef.current && mapRef.current.remove) {
        try {
          mapRef.current.remove();
        } catch {
          // ignore
        }
      }
      mapRef.current = null;
    };
  }, [geojson, center, zoom]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
