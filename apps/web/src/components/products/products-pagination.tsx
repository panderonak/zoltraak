"use client";

import { Button } from "@zoltraak/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function ProductsPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  isFetching,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build a window of page numbers around the current page
  const pages: (number | "…")[] = [];
  const delta = 2;

  const addPage = (n: number) => {
    if (n >= 1 && n <= totalPages) pages.push(n);
  };

  addPage(1);
  if (currentPage - delta > 2) pages.push("…");
  for (let i = currentPage - delta; i <= currentPage + delta; i++) addPage(i);
  if (currentPage + delta < totalPages - 1) pages.push("…");
  addPage(totalPages);

  // Deduplicate
  const unique = pages.filter((p, i, arr) => i === 0 || arr[i - 1] !== p);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage || isFetching}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      {unique.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            className="w-8 text-center text-muted-foreground select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(p as number)}
            disabled={isFetching}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isFetching}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
