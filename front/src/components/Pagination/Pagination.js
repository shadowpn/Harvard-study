// components/Pagination.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  const pageRange = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <nav className="mt-4">
      <ul className="flex justify-center flex-wrap gap-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="neumorphic-button px-3 py-1 text-sm"
            >
              ‹
            </button>
          </li>
        )}

        {pageRange().map((num) => (
          <li key={num}>
            {num === currentPage ? (
              <span className="active-nav px-3 py-1 text-sm">{num}</span>
            ) : (
              <button
                onClick={() => goToPage(num)}
                className="neumorphic-button px-3 py-1 text-sm"
              >
                {num}
              </button>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="neumorphic-button px-3 py-1 text-sm"
            >
              ›
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
