interface MapDisplayProps {
  property?: any;
}

const MapDisplay = ({ property }: MapDisplayProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Location Map</h3>
      <div id="map" className="h-[400px] bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
        {/* Google Maps integration would go here */}
        <p className="text-slate-500 dark:text-slate-400 text-sm">Map will be loaded here</p>
      </div>
    </div>
  );
};

export default MapDisplay;
