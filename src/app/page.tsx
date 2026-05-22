"use client";

import { useState } from "react";
import FilterForm from "@/components/FilterForm";
import ListingCard from "@/components/ListingCard";
import LoadingState from "@/components/LoadingState";
import { FilterParams, Listing } from "@/lib/types";

const PAGE_SIZE = 20;

type SearchState = "idle" | "loading" | "loadingMore" | "done";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<SearchState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function fetchPage(filters: FilterParams, page: number, append: boolean) {
    setState(append ? "loadingMore" : "loading");
    if (!append) {
      setListings([]);
      setError(null);
    }

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters, page }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "שגיאה בחיפוש");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let newCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const item = JSON.parse(line);
            if (item.error) {
              setError(item.error);
            } else {
              newCount++;
              setListings((prev) => [...prev, item as Listing]);
            }
          } catch {
            // skip malformed line
          }
        }
      }

      setHasMore(newCount >= PAGE_SIZE);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
    } finally {
      setState("done");
    }
  }

  async function handleSearch(filters: FilterParams) {
    setCurrentFilters(filters);
    await fetchPage(filters, 1, false);
  }

  async function handleLoadMore() {
    if (!currentFilters) return;
    await fetchPage(currentFilters, currentPage + 1, true);
  }

  const isLoading = state === "loading";
  const isLoadingMore = state === "loadingMore";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">חיפוש דירות להשכרה</h1>
          <p className="text-sm text-gray-500 mt-0.5">נתונים חיים מיד2</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* Filter sidebar */}
          <div className="lg:sticky lg:top-6">
            <FilterForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Results */}
          <div>
            {state === "idle" && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <div className="text-5xl mb-3">🏠</div>
                <p className="text-lg font-medium">בחר פילטרים וחפש דירות</p>
              </div>
            )}

            {isLoading && listings.length === 0 && <LoadingState />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            {listings.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {isLoading ? "טוען..." : `${listings.length} תוצאות`}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Load more */}
                {(state === "done" || isLoadingMore) && (
                  <div className="mt-8 flex justify-center">
                    {hasMore ? (
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 text-gray-700 font-medium rounded-xl px-8 py-3 text-sm transition-colors shadow-sm"
                      >
                        {isLoadingMore ? "טוען..." : "טען עוד תוצאות"}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400">אין עוד תוצאות</p>
                    )}
                  </div>
                )}
              </>
            )}

            {state === "done" && listings.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-lg font-medium">לא נמצאו תוצאות</p>
                <p className="text-sm mt-1">נסה לשנות את הפילטרים</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
