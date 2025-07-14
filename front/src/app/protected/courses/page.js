'use client';
import { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => {
        console.log("Курсы с бэка:", data);
        setCourses(data); // адаптируй на data.results если нужно
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <p className="text-center mt-10 text-lg">Загрузка курсов...</p>;
  }
  if (error) {
    return <p className="text-center mt-10 text-red-600">Ошибка: {error}</p>;
  }
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Courses</h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">Курсы пока не добавлены.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {course.image && (
                <img
                  src={`http://localhost:8000${course.image}`}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                <p className="text-green-600 font-bold">${course.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
