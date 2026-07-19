import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';
import { revalidatePath } from 'next/cache';

async function editable(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 401 };
  if (!isValidObjectId(id)) return { error: 404 };
  await connectDB();
  const [property, user] = await Promise.all([Property.findById(id), User.findById(session.user.id).lean<{ role?: string }>()]);
  if (!property) return { error: 404 };
  if (String(property.owner) !== session.user.id && user?.role !== 'admin') return { error: 403 };
  return { property };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const result = await editable(id);
  if ('error' in result) return NextResponse.json({ error: 'Not available' }, { status: result.error });
  await result.property.deleteOne();
  revalidatePath('/'); revalidatePath('/properties'); revalidatePath('/admin');
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const result = await editable(id);
  if ('error' in result) return NextResponse.json({ error: 'Not available' }, { status: result.error });
  try {
    const body = await request.json();
    const allowed = ['name', 'type', 'description', 'location', 'beds', 'baths', 'square_feet', 'amenities', 'rates', 'seller_info', 'images', 'is_featured'];
    const update = Object.fromEntries(allowed.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
    Object.assign(result.property, update);
    await result.property.save();
    revalidatePath('/'); revalidatePath('/properties'); revalidatePath(`/properties/${id}`); revalidatePath('/admin');
    return NextResponse.json(result.property.toJSON());
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid property data' }, { status: 400 }); }
}
