// components/Course/CourseDescription.js
import { useState } from 'react';

export default function CourseDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const preview = text.slice(0, 300);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Course Description</h2>
      <p className="text-gray-700">
        {expanded ? text : `${preview}...`}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-blue-600 underline text-sm"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      </p>
    </div>
  );
}
