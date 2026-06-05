import { IProperty } from '@/models/Property';

/**
 * Convert Mongoose document fields to plain serializable values.
 *
 * Next.js Server -> Client boundary rejects objects with toJSON methods
 * (e.g. Mongoose ObjectId, Date instances). This helper turns them into
 * plain strings so they can be safely passed as props to Client Components.
 */
export const serializeProperty = (p: IProperty): IProperty => ({
  ...p,
  _id:
    typeof p._id === 'object' && p._id !== null && 'toString' in p._id
      ? (p._id as unknown as { toString(): string }).toString()
      : p._id,
  owner:
    typeof p.owner === 'object' && p.owner !== null && 'toString' in p.owner
      ? (p.owner as unknown as { toString(): string }).toString()
      : p.owner,
  createdAt:
    p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  updatedAt:
    p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
});

export const serializeProperties = (ps: IProperty[]): IProperty[] =>
  ps.map(serializeProperty);
