'use client';

import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard/CourseCard';
import { authorizedFetch } from '@/utils/authHelpers';
import Pagination from '@/components/Pagination/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StorePage() {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await authorizedFetch(`${BASE_URL}/courses/?page=${page}`);
        if (!res.ok) throw new Error('Ошибка при получении курсов');
        const data = await res.json();
        setCourses(data.results);
        setTotalPages(data.total_pages || 1); // предполагается что API возвращает total_pages
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      }
    };

    fetchCourses();
  }, [page]);

  return (
    <section className="px-0 sm:px-6 py-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-right store-color">
        Sense Store
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="flex justify-center mt-auto pb-24 sm:pb-0">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </section>
  );
}
