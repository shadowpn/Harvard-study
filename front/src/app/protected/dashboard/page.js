'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [hasCourses, setHasCourses] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth");
      return;
    }
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
        // Optionally load user courses later
        // fetch("http://localhost:8000/api/user-courses/", {
        //   headers: { Authorization: `Bearer ${token}` },
        // })
        //   .then((res) => res.json())
        //   .then((courses) => setHasCourses(courses.length > 0));
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/auth");
      });
  }, []);
  if (!userData) return <p>Loading dashboard...</p>;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
       Hi, {userData.first_name}
       <Image src="/icons/greating.png" alt="wave" width={32} height={32} className="inline-block" />
    </h1>
      {hasCourses ? (
        <p>Your enrolled courses will appear here...</p>
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
