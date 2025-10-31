"use client";

import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapClient({ geojson }: { geojson: any }) {
  return <MapView geojson={geojson} />;
}
