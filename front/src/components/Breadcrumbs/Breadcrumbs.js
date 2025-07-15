// components/Breadcrumbs.js
'use client';

import Link from 'next/link';

export default function Breadcrumbs({ title }) {
  const maxLen = 40;
  const shortTitle =
    title.length > maxLen ? title.slice(0, maxLen).trim() + '…' : title;

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        font-bold
        mb-4 
        flex items-center 
        space-x-2
        overflow-hidden
        text-[10px]        /* mobile: 10px */
        md:text-[14px]     /* desktop: 14px */
      "
    >
      {/* Ссылка на My Courses */}
      <Link
        href="/dashboard"
        className="text-blue-800 hover:underline whitespace-nowrap font-bold"
      >
        My Courses
      </Link>

      {/* Разделитель */}
      <span className="text-gray-400" aria-hidden="true">
        /
      </span>

      {/* Текущий пункт */}
      <span
        className="text-gray-700 truncate whitespace-nowrap"
        title={title}
      >
        {shortTitle}
      </span>
    </nav>
  );
}
