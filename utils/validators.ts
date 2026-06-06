import { z } from 'zod';

// ---- Enums (must match models/Property.ts schema) ----
export const PROPERTY_TYPES = ['Apartment', 'Condo', 'House', 'Townhouse'] as const;
export const PROPERTY_TYPE_VALUES = PROPERTY_TYPES;

// ---- Property listing query schema ----
// Coerces query strings (which are always strings, or string[]) into the
// right primitive type and clamps them to safe ranges. We use .coerce for
// numerics and split/normalize comma lists ourselves because Next.js hands
// us `string | string[] | undefined`.
const toOptionalInt = (min: number, max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : Number(v)))
    .pipe(z.number().int().min(min).max(max).optional());

const toOptionalFloat = (min: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : Number(v)))
    .pipe(z.number().min(min).optional());

const toOptionalString = z.string().min(1).optional();

const toOptionalCsv = z
  .string()
  .optional()
  .transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined))
  .pipe(z.array(z.string().min(1)).optional());

export const propertyListQuerySchema = z.object({
  type: z.enum(PROPERTY_TYPES).optional(),
  city: toOptionalString,
  minBeds: toOptionalInt(0, 50),
  maxBeds: toOptionalInt(0, 50),
  minSqFt: toOptionalInt(0, 100000),
  maxSqFt: toOptionalInt(0, 100000),
  minPrice: toOptionalFloat(0),
  maxPrice: toOptionalFloat(0),
  amenities: toOptionalCsv,
  page: toOptionalInt(1, 1000),
  limit: toOptionalInt(1, 100),
  view: z.enum(['list', 'map']).optional(),
});

export type PropertyListQuery = z.infer<typeof propertyListQuerySchema>;

// ---- Mongo ObjectId validator ----
export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid id format');

export type ObjectIdString = z.infer<typeof objectIdSchema>;
