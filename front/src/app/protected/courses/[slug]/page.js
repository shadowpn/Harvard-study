// app/protected/courses/[slug]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CourseVideoPlayer from '@/components/Course/CourseVideoPlayer';
import CourseDescription from '@/components/Course/CourseDescription';
import CourseComments from '@/components/Course/CourseComments';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { authorizedFetch } from '@/utils/authHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CoursePage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await authorizedFetch(`${BASE_URL}/courses/${slug}/`);
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error('Course load error:', err);
        setError(err.message);
      }
    };

    loadCourse();
  }, [slug]);

  if (error) return <div className="p-4 text-red-600">Ошибка: {error}</div>;
  if (!course) return <div className="p-4">Загрузка...</div>;

  return (
    <main className="px-4 pb-16 md:px-0 py-6 max-w-screen-xl mx-0 md:mx-auto">
      <Breadcrumbs title={course.title} />
      <h1 className="text-xl sm:text-1xl md:text-2xl font-bold mb-6 text-gray-900 text-center">
        {course.title}
      </h1>

      <CourseVideoPlayer videoUrl={course.video} />
      <CourseDescription text={course.description} />
      <CourseComments />
    </main>
  );
}