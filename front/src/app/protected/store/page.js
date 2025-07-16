'use client';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard/CourseCard';
import { authorizedFetch } from '@/utils/authHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StorePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await authorizedFetch(`${BASE_URL}/courses/`);
        if (!res.ok) throw new Error('Ошибка при получении курсов');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-right store-color">Sense Store</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
