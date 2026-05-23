"use client";

import { useState } from "react";
import FilterForm from "@/components/FilterForm";
import { IdleState } from "@/components/IdleState";
import ListingCard from "@/components/ListingCard";
import LoadingState from "@/components/LoadingState";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoResults } from "@/components/NoResults";
import { Pagination } from "@/components/Pagination";
import { useListings } from "@/hooks/useListings";
import { FilterParams } from "@/lib/types";

export default function Home() {
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, hasMore, listings, error } = useListings({
    filters: currentFilters,
    page: currentPage,
  });

  async function handleSearch(filters: FilterParams) {
    setCurrentFilters(filters);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-6">
            <FilterForm onSearch={handleSearch} isLoading={loading} />
          </div>

          <div>
            {!loading && !currentFilters && <IdleState />}

            {loading && <LoadingState />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            {!loading && (
              <>
                {listings.length > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    עמוד {currentPage} — {listings.length} תוצאות
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {loading && listings?.length === 0 && !error && <NoResults />}

                <Pagination
                  listings={listings}
                  hasMore={hasMore}
                  page={currentPage}
                  goToPage={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
