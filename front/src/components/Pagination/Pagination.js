'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  const generatePageRange = () => {
    const range = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        range.push('...');
      }
    }

    return [...new Set(range)];
  };

  return (
    <nav className="mt-6">
      <ul className="flex justify-center flex-wrap gap-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="neumorphic-button font-bold"
            >
              ‹
            </button>
          </li>
        )}

        {generatePageRange().map((item, index) => (
          <li key={index}>
            {item === '...' ? (
              <span className="text-gray-400 px-2">…</span>
            ) : item === currentPage ? (
              <span className="neumorphic-button bg-indigo-300 text-white font-semibold px-4 py-1 shadow-inner">
                {item}
              </span>
            ) : (
              <button
                onClick={() => goToPage(item)}
                className="neumorphic-button font-medium"
              >
                {item}
              </button>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="neumorphic-button font-bold"
            >
              ›
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
