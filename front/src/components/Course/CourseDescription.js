'use client';
import { useState } from 'react';
import FormattedText from '@/components/FormattedText';

export default function CourseDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const safeText = text?.replace(/\r?\n/g, '\n'); 
  const preview = safeText?.slice(0, 300);

  return (
    <section className="mb-8 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Course Description
      </h2>
      <FormattedText
        text={expanded ? safeText : `${preview}...`}
        className="text-gray-700"
      />
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 inline-block 
                text-blue-500        
                hover:text-blue-700  
                  transition-colors 
                  font-semibold       
                  text-sm"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </section>
  );
}
