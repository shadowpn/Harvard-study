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
    <div className="relative w-full max-w-sm h-auto">
      <BaseCourseCard course={course} onClick={handleStart}>
      <div className="mt-auto flex gap-2">
          {/* Start Button */}
          <button
            className="w-1/2 px-4 py-2 rounded font-semibold text-xs sm:text-base shadow-inner hover:shadow-md active:shadow-none btn-animated-gradient-start"
            onClick={handleStart}
          >
            Start
          </button>

          {/* Delete Button */}
          <button
            className="w-1/2 px-4 py-2 rounded font-semibold text-xs sm:text-base text-red-600 bg-[#f5e7e7] shadow-inner hover:shadow-md active:shadow-none flex items-center justify-center"
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
            Remove
          </button>
        </div>
      </BaseCourseCard>
    </div>
  );
}
