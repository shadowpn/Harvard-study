'use client';

import Image from 'next/image';


export default function BaseCourseCard({ course, children, onImageClick }) {
  return (
    <div className="relative w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Image */}
      <div
        className="relative w-full h-[250px] cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src={course.image?.startsWith('http') ? course.image : `http://localhost:8000${course.image}` || '/img/placeholder.png'}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title & Short Description */}
      <div className="p-5 flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 h-[3em]">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-4 min-h-[5.5em]">
          {course.short_description || 'Description will be add soon.'}
        </p>

        {/* Extendable Content */}
        <div className="mt-auto">{children}</div>
      </div>
    </div>
  );
}
