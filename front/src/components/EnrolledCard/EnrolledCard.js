'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BaseCourseCard from '../BaseCourseCard/BaseCourseCard';
import Image from 'next/image';
import { authorizedFetch } from '@/utils/authHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EnrolledCard({ course, onUnenroll }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    const access = localStorage.getItem('access');
    if (!access) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      router.push('/auth');
      return;
    }

    router.push(`/protected/courses/${course.slug}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await authorizedFetch(`${BASE_URL}/unenroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          router.push('/auth');
        } else {
          throw new Error('Failed to delete course');
        }
        return;
      }

      const saved = JSON.parse(localStorage.getItem('purchasedCourses')) || [];
      const updated = saved.filter((id) => id !== course.id);
      localStorage.setItem('purchasedCourses', JSON.stringify(updated));

      alert('Course was deleted.');

      // ✅ Обновим родителя
      if (onUnenroll) {
        onUnenroll(course.id);
      }

    } catch (err) {
      console.error('Delete error:', err);
      alert('Ошибка при удалении. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm h-[500px]">
      <BaseCourseCard course={course} onClick={handleStart}>
        <div className="mt-auto flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-1/2"
            onClick={handleStart}
          >
            Start
          </button>

          <button
            className="border border-red-300 hover:bg-red-50 text-red-600 px-4 py-2 rounded w-1/2 flex justify-center items-center"
            onClick={handleDelete}
            disabled={loading}
          >
            <Image
              src="/icons/trash.png"
              width={20}
              height={20}
              alt="Delete Icon"
              unoptimized
              className="mr-1"
            />
            Delete
          </button>
        </div>
      </BaseCourseCard>
    </div>
  );
}
