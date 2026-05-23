import { Listing } from "@/lib/types";
import { ListingImage } from "./ListingImage";
import { ListingContent } from "./ListingContent";

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
      <ListingImage listing={listing} />
      <ListingContent listing={listing} />
    </a>
  );
}
