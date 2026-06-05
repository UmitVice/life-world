import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Property from '@/models/Property';

// Returns distinct cities for the filter dropdown
export async function GET() {
  try {
    await connectDB();
    const cities = await Property.distinct('location.city', {
      'location.city': { $exists: true, $nin: [null, ''] },
    });
    const sorted = (cities as string[])
      .filter((c) => typeof c === 'string' && c.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ cities: sorted });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { cities: [], error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
