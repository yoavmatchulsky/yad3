import { Listing } from "@/lib/types";

export function ListingContent({ listing }: { listing: Listing }) {
  return (
    <div className="p-4 flex flex-col gap-2 flex-1">
      {/* Price */}
      <div className="text-2xl font-bold text-blue-600">
        {listing.price > 0
          ? `₪${listing.price.toLocaleString("he-IL")}`
          : "מחיר לא זמין"}
        {listing.price > 0 && (
          <span className="text-sm font-normal text-gray-400"> / חודש</span>
        )}
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
  );
}
