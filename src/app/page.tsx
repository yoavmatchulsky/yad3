"use client";

import { useRef, useState } from "react";
import FilterForm from "@/components/FilterForm";
import ListingCard from "@/components/ListingCard";
import LoadingState from "@/components/LoadingState";
import { FilterParams, Listing } from "@/lib/types";

const PAGE_SIZE = 20;

type SearchState = "idle" | "loading" | "done";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<SearchState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function fetchPage(filters: FilterParams, page: number) {
    setState("loading");
    setListings([]);
    setError(null);

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
      let count = 0;

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
              count++;
              setListings((prev) => [...prev, item as Listing]);
            }
          } catch {
            // skip malformed line
          }
        }
      }

      setHasMore(count >= PAGE_SIZE);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
    } finally {
      setState("done");
    }
  }

  async function handleSearch(filters: FilterParams) {
    setCurrentFilters(filters);
    setCurrentPage(1);
    setHasMore(false);
    await fetchPage(filters, 1);
  }

  async function goToPage(page: number) {
    if (!currentFilters || page < 1) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    await fetchPage(currentFilters, page);
  }

  const isLoading = state === "loading";
  const showResults = listings.length > 0 || (state === "done" && !error);
  const totalKnownPages = hasMore ? currentPage + 1 : currentPage;

  function pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalKnownPages, currentPage + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">יד3</h1>
          <p className="text-sm text-gray-500 mt-0.5">חיפוש דירות להשכרה — נתונים חיים מיד2</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-6">
            <FilterForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div ref={resultsRef}>
            {state === "idle" && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <div className="text-5xl mb-3">🏠</div>
                <p className="text-lg font-medium">בחר פילטרים וחפש דירות</p>
              </div>
            )}

            {isLoading && <LoadingState />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            {!isLoading && showResults && (
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

                {state === "done" && listings.length === 0 && !error && (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-lg font-medium">לא נמצאו תוצאות</p>
                    <p className="text-sm mt-1">נסה לשנות את הפילטרים</p>
                  </div>
                )}

                {/* Pagination */}
                {(listings.length > 0 || currentPage > 1) && (
                  <div className="mt-8 flex items-center justify-center gap-1">
                    {/* Prev */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ‹
                    </button>

                    {/* First page + ellipsis */}
                    {pageNumbers()[0] > 1 && (
                      <>
                        <button onClick={() => goToPage(1)} className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors">
                          1
                        </button>
                        {pageNumbers()[0] > 2 && (
                          <span className="px-2 text-gray-400">…</span>
                        )}
                      </>
                    )}

                    {/* Page numbers */}
                    {pageNumbers().map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        disabled={p === currentPage}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          p === currentPage
                            ? "border-blue-500 bg-blue-500 text-white cursor-default"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={!hasMore}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white px-4 py-6 text-center text-xs text-gray-400">
        פרויקט זה הוא ניסיוני בלבד ואינו מיועד לשימוש ציבורי. הנתונים נשלפים מיד2 ואינם שייכים לפרויקט זה.
      </footer>
    </div>
  );
}
