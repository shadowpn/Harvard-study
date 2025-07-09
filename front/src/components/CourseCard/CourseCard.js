'use client';
import Image from 'next/image';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      <Image
        src={course.image || '/img/placeholder.png'}
        alt={course.title}
        width={400}
        height={200}
        className="rounded object-cover mb-2 w-full h-48"
      />
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>

      <div className="text-sm text-gray-700 mt-2 space-y-1">
        <p>⭐ {course.rating} / 5</p>
        <p>💰 ${course.price}</p>
        <p>⏳ {course.duration} hours</p>
        <p>📅 Starts: {course.start_date}</p>
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-1/2">Buy</button>
        <button className="border border-gray-400 px-3 py-1 rounded w-1/2">Learn more</button>
      </div>
    </div>
  );
}
