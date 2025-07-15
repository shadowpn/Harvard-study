// components/Course/CourseDescription.js
import { useState } from 'react';

export default function CourseDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const preview = text.slice(0, 300);

  return (
    <section className="mb-8 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Course Description
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {expanded ? text : `${preview}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 inline-block 
                text-blue-500        /* заменили 600 → 800 */
                hover:text-blue-700  /* более тёмный ховер */
                  transition-colors 
                  font-semibold        /* полужирный */
                  text-sm"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </section>
  );
}
