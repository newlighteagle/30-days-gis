import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const day = parseInt((await params).day);
    
    if (isNaN(day)) {
      return NextResponse.json({ error: 'Invalid day parameter' }, { status: 400 });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { day },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const day = parseInt((await params).day);
    
    if (isNaN(day)) {
      return NextResponse.json({ error: 'Invalid day parameter' }, { status: 400 });
    }

    const body = await request.json();

    const challenge = await prisma.challenge.update({
      where: { day },
      data: body,
    });

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}
