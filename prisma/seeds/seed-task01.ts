import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const task01 = [
  { name: "Solok Viewpoint", lon: 100.651, lat: -0.784 },
  { name: "Muaro Pingai", lon: 100.611, lat: -0.725 },
  { name: "Saningbakar", lon: 100.586, lat: -0.676 },
  { name: "Paninggahan", lon: 100.568, lat: -0.643 },
  { name: "Singkarak Village", lon: 100.533, lat: -0.602 },
  { name: "Malalo Riverside", lon: 100.497, lat: -0.645 },
  { name: "Sumpur", lon: 100.476, lat: -0.701 },
  { name: "Ombilin", lon: 100.454, lat: -0.764 },
  { name: "Saniangbaka", lon: 100.491, lat: -0.823 },
  { name: "Sumani", lon: 100.545, lat: -0.841 },
];

async function main() {
  console.log("🌱 Start seeding Danau Singkarak points...");

  for (const point of task01) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO task01 (name, geom, "createdAt", "updatedAt")
      VALUES ('${point.name}', ST_SetSRID(ST_MakePoint(${point.lon}, ${point.lat}), 4326), NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
  }

  console.log(
    "✅ Seeding finished: ${task01.length} points inserted around Danau Singkarak."
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
