'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BaseCourseCard from '../BaseCourseCard/BaseCourseCard';
import { refreshToken } from '@/utils/authHelpers';
import Image from 'next/image';

export default function CourseCard({ course }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
   if (typeof window !== 'undefined') {
     const saved = JSON.parse(localStorage.getItem("purchasedCourses")) || [];
     setAdded(saved.includes(course.id));
   }
 }, [course.id]);

  const router = useRouter();

  const handleBuy = async (courseId) => {
  let token = localStorage.getItem("access");

  if (!token) {
    console.error("No access token found");
    alert("Please log in to enroll");
    return;
  }

  try {
    let response = await fetch('http://localhost:8000/api/courses/enroll/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });

    // Обновление токена при необходимости
    if (response.status === 401) {
      const newToken = await refreshToken();
      if (!newToken) {
        alert("Session expired. Please log in again.");
        return;
      }

      response = await fetch('http://localhost:8000/api/courses/enroll/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`
        },
        body: JSON.stringify({ courseId })
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Enroll error:", errorData);
      alert("Something went wrong while enrolling.");
      return;
    }

    // ✅ Добавим в localStorage
    const saved = JSON.parse(localStorage.getItem("purchasedCourses")) || [];
    const updated = [...new Set([...saved, courseId])];
    localStorage.setItem("purchasedCourses", JSON.stringify(updated));

    alert("Enrolled successfully!");
setAdded(true);

setTimeout(() => {
  router.push('/dashboard');
}, 2000);
  } catch (error) {
    console.error('Enrollment error:', error);
    alert('Something went wrong while enrolling.');
  }
};

  const handleFlip = () => setFlipped(!flipped);
  const handleImageClick = () => router.push(`/courses/${course.slug}`);

  const levelColors = {
    Beginner: 'bg-blue-100 text-blue-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };
  const levelColor = levelColors[course.level] || 'bg-gray-100 text-gray-800';

  return (
    <div className="relative w-full max-w-sm h-[500px] perspective">
      <div
        className={`transition-transform duration-500 preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        } h-full`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden backface-hidden flex flex-col">
          <BaseCourseCard course={course} onClick={handleImageClick}>
            {/* Info block */}
            <div className="text-sm text-gray-700 space-y-1 mb-4 mt-auto">
              <p>
                <Image src="/icons/rating.png" width={20} height={20} alt="Rating Icon" className="inline-block mr-1" unoptimized />
                {course.rating} / 5 &nbsp;
                <Image src="/icons/enroled.png" width={20} height={20} alt="Enrolled Icon" className="inline-block mr-1 ml-2" unoptimized />
                {course.enrolled}
              </p>

              <p>
                <Image src="/icons/pricing.png" width={20} height={20} alt="Price Icon" className="inline-block mr-1" unoptimized />
                ${course.price} &nbsp;
                <Image src="/icons/duration.png" width={20} height={20} alt="Duration Icon" className="inline-block mr-1" unoptimized />
                {course.duration} hours
              </p>

              <p>
                <Image src="/icons/start_course.png" width={20} height={20} alt="Start Date Icon" className="inline-block mr-1" unoptimized />
                Start: {course.start_date}
              </p>

              <p>
                <span className={`inline-block ${levelColor} px-2 py-0.5 rounded text-xs mr-2`}>
                  <Image src="/icons/level.png" width={20} height={20} alt="Level Icon" className="inline-block mr-1" unoptimized />
                  {course.level}
                </span>

                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                  <Image src="/icons/certificate.png" width={20} height={20} alt="Certificate Icon" className="inline-block mr-1" unoptimized />
                  Certificate
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2">
              <button
                className={`${
                  added ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                } font-semibold px-4 py-2 rounded w-1/2`}
                onClick={() => handleBuy(course.id)}
                disabled={added}
              >
                {added ? 'Added' : 'Buy'}
              </button>

              <button
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded w-1/2"
                onClick={handleFlip}
              >
                Learn More
              </button>
            </div>
          </BaseCourseCard>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-gray-100 rounded-2xl shadow-xl p-5 backface-hidden rotate-y-180 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">About course</h3>
            <div className="text-sm text-gray-700 h-[370px] overflow-y-auto pr-2 mb-4">
              <p>{course.description || 'Описание скоро будет добавлено.'}</p>
            </div>
          </div>
          <button
            className="mt-4 text-blue-600 hover:underline self-end"
            onClick={handleFlip}
          >
            Back
          </button>
        </div>
      </div>

      {/* 3D Style */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
