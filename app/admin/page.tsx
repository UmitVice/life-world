import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import AdminProperties from '@/components/AdminProperties';

export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') redirect('/');
  await connectDB();
  const properties = await Property.find({}).sort({ createdAt: -1 }).populate('owner', 'email').lean();
  const serializable = properties.map((property: any) => ({ _id: property._id.toString(), name: property.name, type: property.type, owner: property.owner ? { email: property.owner.email } : null, createdAt: property.createdAt.toISOString() }));
  return <section className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><p className="font-medium text-emerald-700">Administration</p><h1 className="text-3xl font-bold">Property management</h1><p className="mt-2 text-slate-600">Review and remove listings across the marketplace.</p></div><AdminProperties properties={serializable} /></section>;
}
