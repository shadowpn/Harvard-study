'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    console.log('🔍 Access token:', token);

    if (!token) {
      console.log('🚨 No token found. Redirecting to /auth...');
      router.replace('/auth');
    } else {
      console.log('✅ Token found. User is logged in.');
    }
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen mobile-gradient-bg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Sense StudyHub</h1>
      <p className="text-gray-600">Checking your login status...</p>
    </main>
  );
}
