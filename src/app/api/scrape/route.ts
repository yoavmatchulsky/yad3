import { NextRequest } from "next/server";
import { scrapeYad2 } from "@/lib/scrapers/yad2";
import { FilterParams } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const filters: FilterParams = await req.json();

  if (!filters.city?.trim()) {
    return new Response(JSON.stringify({ error: "City is required" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const listings = await scrapeYad2(filters);
        for (const listing of listings) {
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify(listing) + "\n"),
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Scraping failed";
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify({ error: msg }) + "\n"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-ndjson",
    },
  });
}
