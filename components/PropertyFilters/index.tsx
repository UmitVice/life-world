"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IProperty } from '@/models/Property';

// Must match the schema enum
const PROPERTY_TYPES = ['Apartment', 'Condo', 'House', 'Townhouse'] as const;

type FilterState = {
  type: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  maxBeds: string;
  amenities: string[];
};

const DEFAULT_FILTERS: FilterState = {
  type: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  maxBeds: '',
  amenities: [],
};

const PropertyFilters: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cities, setCities] = useState<string[]>([]);
  const [allAmenities, setAllAmenities] = useState<string[]>([]);

  // Fetch cities and amenities dynamically
  useEffect(() => {
    let cancelled = false;
    const fetchMeta = async () => {
      try {
        const citiesRes = await fetch('/api/properties/cities', {
          cache: 'no-store',
        });
        if (!citiesRes.ok) return;
        const citiesData = await citiesRes.json();
        if (!cancelled) setCities(citiesData.cities || []);
      } catch {
        // ignore silently
      }
    };
    fetchMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync filters from URL on mount and when URL changes
  useEffect(() => {
    const urlAmenities = searchParams.get('amenities');
    setFilters({
      type: searchParams.get('type') ?? '',
      city: searchParams.get('city') ?? '',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      minBeds: searchParams.get('minBeds') ?? '',
      maxBeds: searchParams.get('maxBeds') ?? '',
      amenities: urlAmenities ? urlAmenities.split(',').filter(Boolean) : [],
    });
  }, [searchParams]);

  // Extract all amenities from the property list
  useEffect(() => {
    let cancelled = false;
    const fetchAllAmenities = async () => {
      try {
        const res = await fetch('/api/properties?limit=100', {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        const set = new Set<string>();
        (data.properties as IProperty[] | undefined)?.forEach((p) => {
          p.amenities?.forEach((a) => set.add(a));
        });
        if (!cancelled) setAllAmenities(Array.from(set).sort());
      } catch {
        // ignore silently
      }
    };
    fetchAllAmenities();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.type) params.set('type', filters.type);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minBeds) params.set('minBeds', filters.minBeds);
    if (filters.maxBeds) params.set('maxBeds', filters.maxBeds);
    if (filters.amenities.length > 0) {
      params.set('amenities', filters.amenities.join(','));
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    });
  }, [filters, pathname, router]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={resetFilters}
          disabled={isPending}
          className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50"
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Property Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            City
          </label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Min Beds
          </label>
          <input
            type="number"
            name="minBeds"
            min={1}
            max={20}
            value={filters.minBeds}
            onChange={handleChange}
            placeholder="Any"
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Max Beds
          </label>
          <input
            type="number"
            name="maxBeds"
            min={1}
            max={20}
            value={filters.maxBeds}
            onChange={handleChange}
            placeholder="Any"
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            min={0}
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="$0"
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            min={0}
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Any"
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {allAmenities.length > 0 && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity) => {
              const active = filters.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={applyFilters}
        disabled={isPending}
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Applying...' : 'Apply Filters'}
      </button>
    </div>
  );
};

export default PropertyFilters;
