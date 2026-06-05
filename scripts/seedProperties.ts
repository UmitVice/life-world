import 'dotenv/config';
import mongoose from 'mongoose';
import Property from '../models/Property';

const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min: number, max: number, decimals = 6): number => {
  const n = Math.random() * (max - min) + min;
  return Number(n.toFixed(decimals));
};

const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// City/state pairs (positional match — do not reorder)
const cityStatePairs: Array<{ city: string; state: string; lat: number; lng: number }> = [
  { city: 'New York',     state: 'NY', lat: 40.7128,  lng: -74.0060 },
  { city: 'Los Angeles',  state: 'CA', lat: 34.0522,  lng: -118.2437 },
  { city: 'Chicago',      state: 'IL', lat: 41.8781,  lng: -87.6298 },
  { city: 'Houston',      state: 'TX', lat: 29.7604,  lng: -95.3698 },
  { city: 'Phoenix',      state: 'AZ', lat: 33.4484,  lng: -112.0740 },
  { city: 'Philadelphia', state: 'PA', lat: 39.9526,  lng: -75.1652 },
  { city: 'San Antonio',  state: 'TX', lat: 29.4241,  lng: -98.4936 },
  { city: 'San Diego',    state: 'CA', lat: 32.7157,  lng: -117.1611 },
  { city: 'Dallas',       state: 'TX', lat: 32.7767,  lng: -96.7970 },
  { city: 'San Jose',     state: 'CA', lat: 37.3382,  lng: -121.8863 },
];

const propertyTypes = ['Apartment', 'Condo', 'House', 'Townhouse'] as const;

const amenitiesList = [
  'High-Speed Internet', 'Air Conditioning', 'Smart TV', 'Coffee Maker',
  'Gym Access', 'Parking Available', 'Pool', 'Balcony/Patio', 'Full Kitchen',
  'Washer & Dryer', 'Outdoor Grill', 'Security System', 'Fireplace', 'Wifi',
];

// Types allowed by the schema (must match the enum)
const ALLOWED_TYPES = new Set<string>(propertyTypes);

// Guarantees a given number of unique amenities (at least 1)
const getUniqueAmenities = (count: number): string[] => {
  const picked = new Set<string>();
  let safety = 0;
  while (picked.size < count && safety < 100) {
    picked.add(getRandomElement(amenitiesList));
    safety++;
  }
  return Array.from(picked);
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  console.log(`Attempting to connect to MongoDB...`);
  await mongoose.connect(uri);
  console.log('Connected to MongoDB successfully.');

  // Use a transaction so either all data is inserted or none of it
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Clear old data
      await Property.deleteMany({}, { session });
      console.log('Cleared old properties.');

      // Valid ObjectId for the dummy owner
      const dummyOwnerId = new mongoose.Types.ObjectId(
        '507f1f77bcf86cd799439011'
      );

      const properties = [];
      const TOTAL = 500;

      for (let i = 1; i <= TOTAL; i++) {
        const cityEntry = getRandomElement(cityStatePairs);
        const type = getRandomElement([...propertyTypes]);
        // Ensure the type is allowed by the schema enum
        if (!ALLOWED_TYPES.has(type)) continue;

        // Small random offset within ~5km of the city center
        const lat = getRandomFloat(cityEntry.lat - 0.05, cityEntry.lat + 0.05);
        const lng = getRandomFloat(cityEntry.lng - 0.05, cityEntry.lng + 0.05);

        const amenities = getUniqueAmenities(getRandomInt(3, 6));

        const property = {
          owner: dummyOwnerId,
          name: `${getRandomElement(['Modern', 'Luxury', 'Cozy', 'Urban', 'Rustic', 'Elite'])} ${type} #${i}`,
          type,
          description:
            `This is a beautiful and spacious ${type} located in ${cityEntry.city}. ` +
            `It features modern amenities, a great location, and plenty of space for your family to enjoy. ` +
            `Perfect for long-term living or short-term stays with premium views and top-tier convenience. ` +
            `Surrounded by restaurants, parks, and cultural attractions, this property offers the best of ${cityEntry.city} living.`,
          location: {
            street: `${getRandomInt(100, 9999)} ${getRandomElement(['Main', 'Oak', 'Maple', 'Pine', 'Cedar', 'Birch', 'Elm', 'Walnut'])} St`,
            city: cityEntry.city,
            state: cityEntry.state,
            zipcode: getRandomInt(10000, 99999).toString(),
            coordinates: { lat, lng },
          },
          beds: getRandomInt(1, 7),
          baths: getRandomInt(1, 5),
          square_feet: getRandomInt(600, 6000),
          amenities,
          rates: {
            nightly: getRandomInt(50, 3000),
            weekly: getRandomInt(300, 7000),
            monthly: getRandomInt(1000, 12000),
          },
          seller_info: {
            name: `Broker ${i}`,
            email: `broker${i}@life-world.example.com`,
            phone: `555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
          },
          // Cycle through existing property images (36 images available)
          images: [`a${(i % 4) + 1}.jpg`],
          is_featured: i % 12 === 0,
        };

        properties.push(property);
      }

      // Batch inserts to avoid memory issues with large data
      const BATCH_SIZE = 100;
      for (let i = 0; i < properties.length; i += BATCH_SIZE) {
        const batch = properties.slice(i, i + BATCH_SIZE);
        await Property.insertMany(batch, { session });
        console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} docs)`);
      }

      console.log(`\n✅ Successfully seeded ${properties.length} properties.`);
    });
  } finally {
    await session.endSession();
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  // Ensure the connection is closed on error
  mongoose.disconnect().finally(() => process.exit(1));
});
