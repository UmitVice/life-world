import connectDB from '@/config/database';
import Property, { IProperty } from '@/models/Property';
import demoSource from '@/properties.json';
import { isValidObjectId } from 'mongoose';

type PropertyFilters = {
  type?: string;
  location?: string;
  limit?: number;
};

const imageSets = [
  ['v1.jpg'],
  ['a1.jpg', 'a2.jpg', 'a3.jpg'],
  ['b1.jpg', 'b2.jpg', 'b3.jpg'],
  ['c1.jpg', 'c2.jpg', 'c3.jpg', 'c4.jpg'],
  ['d1.jpg', 'd2.jpg', 'd3.jpg'],
  ['e1.jpg', 'e2.jpg', 'e3.jpg', 'e4.jpg'],
  ['f1.jpg', 'f2.jpg', 'f3.jpg'],
  ['g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg'],
  ['h1.jpg', 'h2.jpg', 'h3.jpg'],
  ['i1.jpg', 'i2.jpg', 'i3.jpg'],
  ['j1.jpg', 'j2.jpg', 'j3.jpg'],
];

const demoProperties: IProperty[] = demoSource.map((property, index) => ({
  ...property,
  owner: property.owner,
  images: imageSets[index % imageSets.length],
  createdAt: new Date(property.createdAt),
  updatedAt: new Date(property.updatedAt),
})) as IProperty[];

function matchesFilters(property: IProperty, filters: PropertyFilters) {
  const typeMatches = !filters.type || filters.type === 'All' || property.type === filters.type;
  const needle = filters.location?.trim().toLowerCase();
  const locationMatches = !needle || [
    property.location.city,
    property.location.state,
    property.location.zipcode,
  ].some((value) => value?.toLowerCase().includes(needle));
  return typeMatches && locationMatches;
}

export async function getProperties(filters: PropertyFilters = {}) {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const query: Record<string, unknown> = {};
      if (filters.type && filters.type !== 'All') query.type = filters.type;
      if (filters.location?.trim()) {
        const safe = filters.location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const term = new RegExp(safe, 'i');
        query.$or = [
          { 'location.city': term },
          { 'location.state': term },
          { 'location.zipcode': term },
        ];
      }
      const queryBuilder = Property.find(query).sort({ createdAt: -1 });
      if (filters.limit) queryBuilder.limit(filters.limit);
      return await queryBuilder.lean<IProperty[]>();
    } catch (error) {
      console.error('Property database unavailable; serving the demo catalog.', error);
    }
  }

  const filtered = demoProperties.filter((property) => matchesFilters(property, filters));
  return filters.limit ? filtered.slice(0, filters.limit) : filtered;
}

export async function getProperty(id: string) {
  if (process.env.MONGODB_URI && isValidObjectId(id)) {
    try {
      await connectDB();
      const property = await Property.findById(id).lean<IProperty>();
      if (property) return property;
    } catch (error) {
      console.error('Property database unavailable; checking the demo catalog.', error);
    }
  }
  return demoProperties.find((property) => String(property._id) === id) ?? null;
}
