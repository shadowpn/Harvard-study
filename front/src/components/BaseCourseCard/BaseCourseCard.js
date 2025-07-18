'use client';
import Image from 'next/image';

export default function BaseCourseCard({ course, children, onImageClick }) {
  return (
    <div className="relative w-full max-w-sm min-h-[350px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
      
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

      <div className="p-3 sm:p-5 flex flex-col h-full">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight line-clamp-3 sm:line-clamp-2 min-h-[4em] sm:min-h-[3em]">
            {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-4 min-h-[5.5em]">
          {course.short_description || 'Description will be add soon.'}
        </p>  
        <div className="mt-auto">{children}</div>
      </div>
    </div>
  );
}
