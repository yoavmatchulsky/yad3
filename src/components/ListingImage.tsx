import { Listing } from "@/lib/types";

export function ListingImage({ listing }: { listing: Listing }) {
  return (
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
  );
}
