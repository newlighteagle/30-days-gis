import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  const { day } = await params;
  console.log("Day requested:", day);

  try {
    // Ambil data dari PostGIS dalam format GeoJSON
    const result = await prisma.$queryRawUnsafe(`
      SELECT
        id,
        name,
        ST_AsGeoJSON(geom)::json AS geometry
      FROM task01
    `);

    console.log("Result from DB:", result);

    const geojson = {
      type: "FeatureCollection",
      features: (result as any[]).map((r) => ({
        type: "Feature",
        geometry: r.geometry,
        properties: {
          id: r.id,
          name: r.name,
        },
      })),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    );
  }
}
