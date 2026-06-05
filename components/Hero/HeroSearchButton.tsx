'use client';

const HeroSearchButton = () => {
  return (
    <div className="md:col-span-3 flex justify-center">
      <button
        type="submit"
        className="inline-flex items-center rounded-xl bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition shadow-sm"
      >
        Search
      </button>
    </div>
  );
};

export default HeroSearchButton;
