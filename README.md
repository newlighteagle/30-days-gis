# 30 Days Map Challenge

A Next.js application for a 30-day mapping challenge using MapLibreGL, PostgreSQL with PostGIS, and Prisma ORM.

## Features

- **Dashboard**: Overview of all 30 challenges with progress tracking
- **Sidebar Navigation**: Quick access to all challenge days
- **Interactive Maps**: MapLibreGL integration for rendering spatial data
- **Challenge Pages**: Individual pages for each day's map challenge
- **Progress Tracking**: Mark challenges as complete and track your progress
- **PostGIS Integration**: Store and query geospatial data in PostgreSQL

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **Maps**: MapLibreGL

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ with PostGIS extension
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

Dependencies are already installed. If needed:

```bash
npm install
```

### 2. Set Up Database

Create a PostgreSQL database with PostGIS:

```sql
CREATE DATABASE 30days_map_challenge;
\c 30days_map_challenge
CREATE EXTENSION postgis;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/30days_map_challenge"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

Populate the database with 30 challenges:

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
30days/
├── app/
│   ├── api/
│   │   └── challenges/         # API routes for challenge data
│   ├── challenge/
│   │   └── [day]/             # Dynamic challenge pages
│   ├── layout.tsx             # Root layout with sidebar
│   └── page.tsx               # Dashboard page
├── components/
│   ├── MapView.tsx            # MapLibreGL component
│   └── Sidebar.tsx            # Navigation sidebar
├── lib/
│   └── prisma.ts              # Prisma client instance
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data for challenges
└── README.md
```

## Usage

### Viewing Challenges

- Navigate to the dashboard at `/` to see all challenges
- Click on any challenge card or use the sidebar to open individual challenge pages

### Marking Challenges as Complete

- On any challenge page, click the "Mark as Complete" button
- Progress is automatically updated in the sidebar and dashboard

### Adding Map Data

To add GeoJSON data to a challenge, update it via the API or directly in the database:

```typescript
// Example: Update challenge with GeoJSON
await prisma.challenge.update({
  where: { day: 1 },
  data: {
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          },
          properties: {
            name: 'San Francisco'
          }
        }
      ]
    }
  }
});
```

## Database Schema

The `Challenge` model includes:

- `id`: Auto-incrementing primary key
- `day`: Unique day number (1-30)
- `title`: Challenge title
- `description`: Optional description
- `type`: Geometry type (Points, Lines, Polygons, Mixed)
- `completed`: Boolean flag for completion status
- `geojson`: JSON field for storing GeoJSON data
- `createdAt`, `updatedAt`: Timestamps

## API Routes

### GET `/api/challenges`

Fetch all challenges.

### GET `/api/challenges/[day]`

Fetch a specific challenge by day number.

### PATCH `/api/challenges/[day]`

Update a challenge (e.g., mark as complete, add GeoJSON data).

```json
{
  "completed": true,
  "geojson": { ... }
}
```

## Customization

### Map Styles

Update the map style in `components/MapView.tsx`:

```typescript
style: 'https://your-custom-style.json'
```

### Challenge Data

Modify the challenges in `prisma/seed.ts` to customize titles, descriptions, and types.

## Troubleshooting

### Prisma Client Issues

If you encounter Prisma client errors, regenerate the client:

```bash
npx prisma generate
```

### PostGIS Extension Error

Make sure PostGIS is installed and enabled:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Map Not Loading

Check that MapLibreGL CSS is imported in `components/MapView.tsx` and that your style URL is accessible.

## License

MIT
