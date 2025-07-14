'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import EnrolledCard from '@/components/EnrolledCard/EnrolledCard';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth");
      return;
    }
  
    // Получаем пользователя
    fetch("http://localhost:8000/api/user/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/auth");
      });
  
    // ✅ Получаем список зачисленных курсов
    fetch("http://localhost:8000/api/enrolled-courses/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        return res.json();
      })
      .then((data) => {
        setCourses(data);         // Обновляем стейт
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses", err);
        setLoading(false);
      });
  }, []);  

  const handleUnenroll = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  if (loading || !userData) return <p>Loading dashboard...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Hi, {userData.first_name}
        <Image src="/icons/greating.png" alt="wave" width={32} height={32} className="inline-block" />
      </h1>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {courses.map(course => (
            <EnrolledCard key={course.id} course={course} onUnenroll={handleUnenroll} />
          ))}
        </div>
      ) : (
        <div className="text-gray-600 mt-10">
          <h2 className="text-xl font-semibold mb-2">You don’t have any courses yet</h2>
          <p>
            Go to the <strong>Store</strong> section to choose your path
            <Image src="/icons/pathstudy.png" alt="graduation cap" width={32} height={32} className="inline-block ml-1" />
          </p>
        </div>
      )}
    </main>
  );
}
