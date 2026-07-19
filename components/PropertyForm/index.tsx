'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const initial = { name: '', type: 'Apartment', description: '', street: '', city: '', state: '', zipcode: '', beds: '1', baths: '1', square_feet: '500', amenities: '', images: '', nightly: '', weekly: '', monthly: '', sellerName: '', sellerEmail: '', sellerPhone: '' };

export default function PropertyForm() {
  const [form, setForm] = useState(initial); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const router = useRouter();
  const change = (key: keyof typeof initial, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    const payload = { name: form.name, type: form.type, description: form.description, beds: Number(form.beds), baths: Number(form.baths), square_feet: Number(form.square_feet), amenities: form.amenities, images: form.images, location: { street: form.street, city: form.city, state: form.state, zipcode: form.zipcode }, rates: { nightly: form.nightly || undefined, weekly: form.weekly || undefined, monthly: form.monthly || undefined }, seller_info: { name: form.sellerName, email: form.sellerEmail, phone: form.sellerPhone } };
    const response = await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) return setError(result.error || 'The property could not be saved.');
    router.push(`/properties/${result._id}`); router.refresh();
  }
  const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30';
  return <form onSubmit={submit} className="space-y-6">
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4 md:grid-cols-2"><label>Property name<input required className={input} value={form.name} onChange={(e) => change('name', e.target.value)} /></label><label>Type<select className={input} value={form.type} onChange={(e) => change('type', e.target.value)}>{['Apartment','Condo','House','Townhouse','Villa','Room','Land','Other'].map((type) => <option key={type}>{type}</option>)}</select></label></div>
    <label>Description<textarea required minLength={50} rows={5} className={input} value={form.description} onChange={(e) => change('description', e.target.value)} /><span className="text-xs text-slate-500">At least 50 characters.</span></label>
    <div className="grid gap-4 md:grid-cols-4">{(['street','city','state','zipcode'] as const).map((key) => <label key={key} className="capitalize">{key}<input className={input} value={form[key]} onChange={(e) => change(key, e.target.value)} /></label>)}</div>
    <div className="grid gap-4 md:grid-cols-3">{(['beds','baths','square_feet'] as const).map((key) => <label key={key} className="capitalize">{key.replace('_',' ')}<input required min="0" type="number" className={input} value={form[key]} onChange={(e) => change(key, e.target.value)} /></label>)}</div>
    <label>Amenities<input required className={input} placeholder="Wi-Fi, parking, pool" value={form.amenities} onChange={(e) => change('amenities', e.target.value)} /></label><label>Image filenames<input required className={input} placeholder="a1.jpg, a2.jpg" value={form.images} onChange={(e) => change('images', e.target.value)} /><span className="text-xs text-slate-500">Use files already in public/images/properties.</span></label>
    <div className="grid gap-4 md:grid-cols-3">{(['nightly','weekly','monthly'] as const).map((key) => <label key={key} className="capitalize">{key} rate ($)<input min="0" type="number" className={input} value={form[key]} onChange={(e) => change(key, e.target.value)} /></label>)}</div>
    <div className="grid gap-4 md:grid-cols-3">{([['sellerName','Seller name'],['sellerEmail','Seller email'],['sellerPhone','Seller phone']] as const).map(([key,label]) => <label key={key}>{label}<input type={key === 'sellerEmail' ? 'email' : 'text'} className={input} value={form[key]} onChange={(e) => change(key, e.target.value)} /></label>)}</div>
    <button disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Publish property'}</button>
  </form>;
}
