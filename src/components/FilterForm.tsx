"use client";

import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { FilterParams } from "@/lib/types";

interface FilterFormProps {
  onSearch: (filters: FilterParams) => void;
  isLoading: boolean;
}

export default function FilterForm({ onSearch, isLoading }: FilterFormProps) {
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [maxRooms, setMaxRooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const citySuggestions =
    city.trim().length > 0
      ? CITIES.filter(
          (c) =>
            c.name.toLowerCase().includes(city.toLowerCase()) ||
            c.nameHe.includes(city),
        ).slice(0, 6)
      : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({
      city,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRooms: minRooms ? Number(minRooms) : undefined,
      maxRooms: maxRooms ? Number(maxRooms) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      maxArea: maxArea ? Number(maxArea) : undefined,
    });
    setShowSuggestions(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        סינון דירות להשכרה
      </h2>

      {/* City */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          עיר *
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => city && setShowSuggestions(true)}
          placeholder="חפש עיר..."
          required
          className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="auto"
        />
        {showSuggestions && citySuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg overflow-hidden">
            {citySuggestions.map((c) => (
              <li
                key={c.code}
                onMouseDown={() => {
                  setCity(c.nameHe);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between"
              >
                <span>{c.nameHe}</span>
                <span className="text-gray-400 text-xs">{c.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            מחיר מינימום (₪)
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="3,000"
            min={0}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            מחיר מקסימום (₪)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="8,000"
            min={0}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rooms range */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            חדרים מינימום
          </label>
          <input
            type="number"
            value={minRooms}
            onChange={(e) => setMinRooms(e.target.value)}
            placeholder="2"
            min={1}
            step={0.5}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            חדרים מקסימום
          </label>
          <input
            type="number"
            value={maxRooms}
            onChange={(e) => setMaxRooms(e.target.value)}
            placeholder="4"
            min={1}
            step={0.5}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Area range */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            שטח מינימום (מ"ר)
          </label>
          <input
            type="number"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            placeholder="40"
            min={0}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            שטח מקסימום (מ"ר)
          </label>
          <input
            type="number"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            placeholder="120"
            min={0}
            className="w-full border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !city.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
      >
        {isLoading ? "מחפש..." : "חיפוש"}
      </button>
    </form>
  );
}
