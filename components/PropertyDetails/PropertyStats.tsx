interface PropertyStatsProps {
  beds: number;
  baths: number;
  squareFeet: number;
}

const PropertyStats = ({ beds, baths, squareFeet }: PropertyStatsProps) => {
  return (
    <div className="flex justify-center gap-6 text-emerald-700 mb-4 text-lg">
      <span>{beds}<span className="hidden sm:inline ml-1">bd</span></span>
      <span>{baths}<span className="hidden sm:inline ml-1">ba</span></span>
      <span>{squareFeet}<span className="hidden sm:inline ml-1">sqft</span></span>
    </div>
  );
};

export default PropertyStats;
