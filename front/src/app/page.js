'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <main>
      <h1>Welcome to Sense StudyHub</h1>
      <p>
        {isLoggedIn
          ? "You are logged in!"
          : "Please login to access your dashboard."}
      </p>
    </main>
  );
}

