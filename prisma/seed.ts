import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const challenges = [
  { day: 1, title: 'Points', description: 'Display point features on a map', type: 'Points' },
  { day: 2, title: 'Lines', description: 'Display line features on a map', type: 'Lines' },
  { day: 3, title: 'Polygons', description: 'Display polygon features on a map', type: 'Polygons' },
  { day: 4, title: 'Hexagons', description: 'Create hexagonal grids', type: 'Polygons' },
  { day: 5, title: 'A map with data from OpenStreetMap', description: 'Use OSM data', type: 'Mixed' },
  { day: 6, title: 'Asia', description: 'Map focused on Asia', type: 'Polygons' },
  { day: 7, title: 'Navigation', description: 'Routing and navigation', type: 'Lines' },
  { day: 8, title: 'Africa', description: 'Map focused on Africa', type: 'Polygons' },
  { day: 9, title: 'AI only', description: 'AI-generated map', type: 'Mixed' },
  { day: 10, title: 'North America', description: 'Map focused on North America', type: 'Polygons' },
  { day: 11, title: 'Arctic', description: 'Map of Arctic region', type: 'Polygons' },
  { day: 12, title: 'Time and space', description: 'Temporal-spatial visualization', type: 'Mixed' },
  { day: 13, title: 'A new tool', description: 'Try a new mapping tool', type: 'Mixed' },
  { day: 14, title: 'A world map', description: 'Global perspective map', type: 'Polygons' },
  { day: 15, title: 'Data day: My data', description: 'Personal dataset visualization', type: 'Mixed' },
  { day: 16, title: 'Choropleth', description: 'Thematic map with colored areas', type: 'Polygons' },
  { day: 17, title: 'Collaborative map', description: 'Multi-user mapping', type: 'Mixed' },
  { day: 18, title: 'Climate', description: 'Climate data visualization', type: 'Mixed' },
  { day: 19, title: 'Typography', description: 'Map labels and text styling', type: 'Mixed' },
  { day: 20, title: 'OpenStreetMap', description: 'Deep dive into OSM', type: 'Mixed' },
  { day: 21, title: 'Conflict', description: 'Conflict and crisis mapping', type: 'Mixed' },
  { day: 22, title: 'Two colours', description: 'Map with only two colors', type: 'Mixed' },
  { day: 23, title: 'Memory', description: 'Personal memory mapping', type: 'Mixed' },
  { day: 24, title: 'Only circular shapes', description: 'Circles and circular patterns', type: 'Points' },
  { day: 25, title: 'Heat', description: 'Heatmap visualization', type: 'Points' },
  { day: 26, title: 'Map projections', description: 'Explore different projections', type: 'Polygons' },
  { day: 27, title: 'Micromapping', description: 'Very detailed small-area mapping', type: 'Mixed' },
  { day: 28, title: 'The Blue Planet', description: 'Ocean and water features', type: 'Polygons' },
  { day: 29, title: 'Overture', description: 'Overture Maps data', type: 'Mixed' },
  { day: 30, title: 'The final map', description: 'Your capstone project', type: 'Mixed' },
];

async function main() {
  console.log('Start seeding...');
  
  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { day: challenge.day },
      update: {},
      create: challenge,
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
