import PropertyForm from '@/components/PropertyForm';

const PropertyAddPage = () => <section className="mx-auto max-w-4xl px-4 py-10"><h1 className="mb-2 text-3xl font-bold">List a property</h1><p className="mb-8 text-slate-600">Add the important details below. Fields marked by validation are required.</p><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><PropertyForm /></div></section>;

export default PropertyAddPage;
