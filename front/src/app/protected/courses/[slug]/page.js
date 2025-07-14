'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/app/protected/layout';
import CourseVideoPlayer from '@/components/Course/CourseVideoPlayer';
import CourseDescription from '@/components/Course/CourseDescription';
import CourseChat from '@/components/Course/CourseChat';
export default function CoursePage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`http://localhost:8000/api/courses/${slug}/`);
        
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.message);
      }
    }
    fetchCourse();
  }, [slug]);
  if (error) return <div className="p-4 text-red-600">Ошибка: {error}</div>;
  if (!course) return <div className="p-4">Загрузка...</div>;
  const videoUrl = `http://localhost:8000${course.video_file}`;
  return (
    <div className="w-full p-8">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <CourseVideoPlayer videoUrl={videoUrl} />
      <CourseDescription text={course.description} />
      <CourseChat courseId={course.id} />
    </div>
  );
}
