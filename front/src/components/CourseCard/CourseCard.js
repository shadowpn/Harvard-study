'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BaseCourseCard from '../BaseCourseCard/BaseCourseCard';
import { authorizedFetch } from '@/utils/authHelpers';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CourseCard({ course }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem("purchasedCourses")) || [];
      setAdded(saved.includes(course.id));
    }
  }, [course.id]);

  const handleBuy = async (courseId) => {
    try {
      let response = await authorizedFetch(`${BASE_URL}/courses/enroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Enroll error:", errorData);
        alert("Something went wrong while enrolling.");
        return;
      }

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
            <div className="text-[12px] sm:text-sm text-gray-700 space-y-1 mb-4 mt-auto">
             <div className=" mb-0">
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
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <span className={`inline-block ${levelColor} px-2 py-0.5 rounded text-xs mr-2`}>
                  <Image src="/icons/level.png" width={20} height={20} alt="Level Icon" className="inline-block mr-1" unoptimized />
                  {course.level}
                </span>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                  <Image src="/icons/certificate.png" width={20} height={20} alt="Certificate Icon" className="inline-block mr-1" unoptimized />
                  Certificate
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2">
              <button
                className={`w-1/2 px-4 py-2 rounded font-semibold text-xs sm:text-base 
                  ${added
                    ? 'text-gray-600 bg-[#b2b2d5] shadow-inner border border-gray-200'
                    : 'btn-animated-gradient shadow-inner hover:shadow-md active:shadow-none'
                  }`}
                onClick={() => handleBuy(course.id)}
                disabled={added}
              >
                {added ? 'Added' : 'Buy'}
              </button>

              <button
                className="w-1/2 px-4 py-2 rounded font-semibold text-xs sm:text-base text-gray-800 bg-[#e2f0d7] shadow-inner hover:shadow-md active:shadow-none"
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
            <div className="text-sm text-gray-700 h-[370px] overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
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
