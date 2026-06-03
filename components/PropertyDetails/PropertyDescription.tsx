interface PropertyDescriptionProps {
  property: any;
}

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Description & Details</h3>
      <div className="flex justify-center gap-6 text-emerald-700 mb-4 text-lg">
        <span>{property?.beds}<span className="hidden sm:inline ml-1"> bd</span></span>
        <span>{property?.baths}<span className="hidden sm:inline ml-1"> ba</span></span>
        <span>{property?.square_feet}<span className="hidden sm:inline ml-1"> sqft</span></span>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{property?.description}</p>
    </div>
  );
};

export default PropertyDescription;
