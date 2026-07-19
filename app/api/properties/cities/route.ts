import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getProperties } from '@/utils/propertyRepository';

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
    const fallbackProperties = await getProperties();
    const cities = Array.from(new Set(fallbackProperties.map((property) => property.location.city).filter((city): city is string => Boolean(city)))).sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ cities });
  }
}
