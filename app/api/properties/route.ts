import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/database';
import Property from '@/models/Property';

// Helper: safely converts a query string value to a number
const toInt = (value: string | null): number | undefined => {
  if (value === null || value === '') return undefined;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
};

const toFloat = (value: string | null): number | undefined => {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Parse query parameters safely
    const type = searchParams.get('type');
    const minBeds = toInt(searchParams.get('minBeds'));
    const maxBeds = toInt(searchParams.get('maxBeds'));
    const minSqFt = toInt(searchParams.get('minSqFt'));
    const maxSqFt = toInt(searchParams.get('maxSqFt'));
    const city = searchParams.get('city');
    const minPrice = toFloat(searchParams.get('minPrice'));
    const maxPrice = toFloat(searchParams.get('maxPrice'));
    const amenitiesParam = searchParams.get('amenities');
    const amenities = amenitiesParam
      ? amenitiesParam.split(',').map((a) => a.trim()).filter(Boolean)
      : undefined;

    // Pagination: default limit 50, max 100 (prevent abuse)
    const page = Math.max(1, toInt(searchParams.get('page')) ?? 1);
    const rawLimit = toInt(searchParams.get('limit')) ?? 50;
    const limit = Math.min(100, Math.max(1, rawLimit));

    // Dynamic query object — only add defined fields
    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (minBeds !== undefined || maxBeds !== undefined) {
      const beds: Record<string, number> = {};
      if (minBeds !== undefined) beds.$gte = minBeds;
      if (maxBeds !== undefined) beds.$lte = maxBeds;
      query.beds = beds;
    }

    if (minSqFt !== undefined || maxSqFt !== undefined) {
      const sqft: Record<string, number> = {};
      if (minSqFt !== undefined) sqft.$gte = minSqFt;
      if (maxSqFt !== undefined) sqft.$lte = maxSqFt;
      query.square_feet = sqft;
    }

    if (city) {
      query['location.city'] = city;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const price: Record<string, number> = {};
      if (minPrice !== undefined) price.$gte = minPrice;
      if (maxPrice !== undefined) price.$lte = maxPrice;
      // Match if nightly, weekly, or monthly rates fall within range
      query.$or = [
        { 'rates.nightly': price },
        { 'rates.weekly': price },
        { 'rates.monthly': price },
      ];
    }

    if (amenities && amenities.length > 0) {
      query.amenities = { $in: amenities };
    }

    const skip = (page - 1) * limit;

    // Run find and count in parallel (performance)
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    return NextResponse.json({
      properties,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page,
      total,
      limit,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
