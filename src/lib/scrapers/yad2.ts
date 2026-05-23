import { findCityCode } from "../cities";
import { FilterParams, Listing } from "../types";

function buildYad2Url(filters: FilterParams): string {
  const params = new URLSearchParams();

  const cityCode = findCityCode(filters.city);
  if (cityCode !== null) {
    params.set("city", String(cityCode));
  } else {
    params.set("cityText", filters.city);
  }

  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minRooms) params.set("minRooms", String(filters.minRooms));
  if (filters.maxRooms) params.set("maxRooms", String(filters.maxRooms));
  if (filters.minArea) params.set("minArea", String(filters.minArea));
  if (filters.maxArea) params.set("maxArea", String(filters.maxArea));
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));

  return `https://www.yad2.co.il/realestate/rent?${params.toString()}`;
}

interface Yad2Item {
  token: string;
  price?: number;
  address?: {
    city?: { text?: string };
    neighborhood?: { text?: string };
    street?: { text?: string };
    house?: { number?: number; floor?: number };
  };
  additionalDetails?: {
    roomsCount?: number;
    squareMeter?: number;
  };
  metaData?: {
    coverImage?: string;
  };
}

interface NextData {
  props?: {
    pageProps?: {
      dehydratedState?: {
        queries?: Array<{
          queryKey: unknown[];
          state: {
            data: {
              private?: Yad2Item[];
              commercial?: Yad2Item[];
            };
          };
        }>;
      };
    };
  };
}

function extractListings(html: string, cityName: string): Listing[] {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/,
  );
  if (!match) return [];

  let data: NextData;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return [];
  }

  const queries = data?.props?.pageProps?.dehydratedState?.queries || [];
  const feedQuery = queries.find(
    (q) => q.queryKey?.[0] === "realestate-rent-feed",
  );

  if (!feedQuery) return [];

  const items: Yad2Item[] = [
    ...(feedQuery.state.data?.private || []),
    ...(feedQuery.state.data?.commercial || []),
  ];

  return items
    .filter((item) => item.token && item.price)
    .map((item) => {
      const street = item.address?.street?.text || "";
      const houseNum = item.address?.house?.number;
      const address = houseNum ? `${street} ${houseNum}`.trim() : street;

      return {
        id: item.token,
        title: address || item.address?.neighborhood?.text || cityName,
        price: item.price ?? 0,
        rooms: item.additionalDetails?.roomsCount ?? 0,
        area: item.additionalDetails?.squareMeter ?? 0,
        floor: item.address?.house?.floor,
        address,
        neighborhood: item.address?.neighborhood?.text,
        city: item.address?.city?.text || cityName,
        imageUrl: item.metaData?.coverImage || undefined,
        link: `https://www.yad2.co.il/item/${item.token}`,
      };
    });
}

export async function scrapeYad2(filters: FilterParams): Promise<Listing[]> {
  const url = buildYad2Url(filters);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cache-Control": "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  if (!res.ok) {
    throw new Error(`Yad2 returned status ${res.status}`);
  }

  const html = await res.text();
  return extractListings(html, filters.city);
}
