import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry
      FROM task01;
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.map((row) => ({
        type: "Feature",
        geometry: row.geometry,
        properties: {
          id: row.id,
          name: row.name,
        },
      })),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
