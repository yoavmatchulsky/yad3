import { useEffect, useState } from "react";
import { FilterParams, Listing } from "@/lib/types";

type UseListingsProps = {
  filters: FilterParams | null;
  page: number;
};

export function useListings({ filters, page }: UseListingsProps) {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  async function getListings(): Promise<{
    count: number;
    listings: Listing[];
  }> {
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

    return await parseListings(reader);
  }

  async function parseListings(reader: ReadableStreamDefaultReader) {
    const listings: Listing[] = [];
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
            listings.push(item);
          }
        } catch {
          // skip malformed line
        }
      }
    }

    return { count, listings };
  }

  useEffect(() => {
    if (!filters || loading) return;

    setLoading(true);
    setError(null);
    getListings()
      .then(({ count, listings }) => {
        console.log({ count, listings });
        setListings(listings);
        setHasMore(count >= 20);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
      })
      .finally(() => {
        setLoading(false);
        console.log("finished");
      });
  }, [filters, page]);

  return {
    listings,
    hasMore,
    error,
    loading,
  };
}
