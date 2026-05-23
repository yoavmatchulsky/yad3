import { Listing } from "@/lib/types";

type PaginationProps = {
  listings: Listing[];
  hasMore: boolean;
  goToPage: (page: number) => void;
  page: number;
};

export function Pagination({
  listings,
  hasMore,
  goToPage,
  page,
}: PaginationProps) {
  if (!listings?.length || !page) {
    return null;
  }

  const totalKnownPages = hasMore ? page + 1 : page;

  function pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalKnownPages, page + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        ‹
      </button>

      {/* First page + ellipsis */}
      {pageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
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
          disabled={p === page}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
            p === page
              ? "border-blue-500 bg-blue-500 text-white cursor-default"
              : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => goToPage(page + 1)}
        disabled={!hasMore}
        className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}
