'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BaseCourseCard from '../BaseCourseCard/BaseCourseCard';
import Image from 'next/image';

export default function EnrolledCard({ course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const handleStart = () => {
    if (!token) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      router.push('/auth');
      return;
    }

    router.push(`/protected/courses/${course.slug}`);
  };

  const handleDelete = async () => {
    if (!token) {
      alert('Вы не авторизованы.');
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/unenroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          router.push('/auth');
          return;
        }
        throw new Error('Failed to delete course');
      }

      const saved = JSON.parse(localStorage.getItem('purchasedCourses')) || [];
      const updated = saved.filter((id) => id !== course.id);
      localStorage.setItem('purchasedCourses', JSON.stringify(updated));

      alert('Курс удалён с панели.');
      setTimeout(() => {
        router.refresh();
      }, 1500);

    } catch (error) {
      console.error('Delete error:', error);
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
