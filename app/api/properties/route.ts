import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { propertyListQuerySchema } from '@/utils/validators';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Build a plain object out of URLSearchParams so zod can validate it.
    // Zod will coerce strings to numbers where appropriate.
    const { searchParams } = new URL(request.url);
    const raw: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      // When the same key appears multiple times, take the first one.
      // The schema only accepts single strings for the relevant fields.
      if (!(k in raw)) raw[k] = v;
    });

    const parsed = propertyListQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      type,
      city,
      minBeds,
      maxBeds,
      minSqFt,
      maxSqFt,
      minPrice,
      maxPrice,
      amenities,
      page = 1,
      limit = 50,
    } = parsed.data;

    // Dynamic query object — only add defined fields
    const query: Record<string, unknown> = {};

    if (type) query.type = type;
    if (city) query['location.city'] = city;

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
