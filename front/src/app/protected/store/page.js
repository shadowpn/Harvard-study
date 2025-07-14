'use client';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard/CourseCard';

export default function StorePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('http://localhost:8000/api/courses/');
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
