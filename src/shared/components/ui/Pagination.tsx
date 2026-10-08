import { ChevronLeft, ChevronRight } from 'lucide-react'

type PageItem = number | 'ellipsis'

// First/last page plus a 3-page window around the current one, e.g. 1 … 5 6 7 … 13
function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const start = Math.max(2, Math.min(page - 1, pageCount - 4))
  const end = Math.min(pageCount - 1, Math.max(page + 1, 5))
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return [
    1,
    ...(start > 2 ? (['ellipsis'] as const) : []),
    ...middle,
    ...(end < pageCount - 1 ? (['ellipsis'] as const) : []),
    pageCount,
  ]
}

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <nav className="flex items-center gap-x-1" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-text btn-square btn-sm"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </button>

      {getPageItems(page, pageCount).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="text-muted px-1">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="btn btn-text btn-square btn-sm aria-[current='page']:text-bg-primary"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="btn btn-text btn-square btn-sm"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
