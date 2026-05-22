import { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <a
      href={listing.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            🏠
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Price */}
        <div className="text-2xl font-bold text-blue-600">
          {listing.price > 0 ? `₪${listing.price.toLocaleString("he-IL")}` : "מחיר לא זמין"}
          {listing.price > 0 && <span className="text-sm font-normal text-gray-400"> / חודש</span>}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 text-sm text-gray-600 flex-wrap">
          {listing.rooms > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🛏</span>
              {listing.rooms} חדרים
            </span>
          )}
          {listing.area > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">📐</span>
              {listing.area} מ"ר
            </span>
          )}
          {listing.floor !== undefined && listing.floor > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🏢</span>
              קומה {listing.floor}
            </span>
          )}
        </div>

        {/* Address */}
        {listing.address && (
          <div className="text-sm text-gray-700 font-medium" dir="rtl">
            {listing.address}
          </div>
        )}

        {/* Neighborhood / city */}
        <div className="text-xs text-gray-400" dir="rtl">
          {[listing.neighborhood, listing.city].filter(Boolean).join(", ")}
        </div>
      </div>
    </a>
  );
}
