'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProperties({ properties }: { properties: { _id: string; name: string; type: string; owner: { email?: string } | null; createdAt: string }[] }) {
  const [items, setItems] = useState(properties); const [busy, setBusy] = useState<string | null>(null); const router = useRouter();
  async function remove(id: string) { if (!window.confirm('Delete this property? This cannot be undone.')) return; setBusy(id); const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' }); if (response.ok) { setItems((current) => current.filter((item) => item._id !== id)); router.refresh(); } else alert('Unable to delete the property.'); setBusy(null); }
  return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Property</th><th className="p-4">Owner</th><th className="p-4">Created</th><th className="p-4">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-t border-slate-100"><td className="p-4"><p className="font-semibold">{item.name}</p><p className="text-slate-500">{item.type}</p></td><td className="p-4 text-slate-600">{item.owner?.email || 'Unknown'}</td><td className="p-4 text-slate-600">{new Date(item.createdAt).toLocaleDateString()}</td><td className="p-4"><Link className="mr-3 text-emerald-700 hover:underline" href={`/properties/${item._id}`}>View</Link><button disabled={busy === item._id} onClick={() => remove(item._id)} className="text-red-700 hover:underline disabled:opacity-50">{busy === item._id ? 'Deleting…' : 'Delete'}</button></td></tr>)}</tbody></table>{!items.length && <p className="p-6 text-slate-500">No properties found.</p>}</div>;
}
