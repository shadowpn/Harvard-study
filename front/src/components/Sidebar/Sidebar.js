'use client';
import styles from './Sidebar.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    }
  }, []);
  const menu = [
    { name: 'My Courses', path: '/dashboard', img: '/icons/courses.png' },
    { name: 'Store', path: '/store', img: '/icons/store.png' },
  ];

  return (
    <aside className="w-60 h-screen bg-white shadow-lg p-4 fixed">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Image src="/icons/learnhub.png" alt="Sense StudyHub" width={40} height={40} />
          Sense StudyHub
        </div>
        <hr></hr>
        {userData && (
          <div className="flex items-center gap-1 mt-1">
            <Image
              src="/icons/aсtive.png"
              alt="greeting icon"
              width={30}
              height={30}
              className="inline-block"
            />
            <p className="text-sm text-gray-500 text-center font-bold">Welcome, {userData.first_name}</p>
            
          </div>
        )}
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-3 py-2 rounded ${
              pathname === item.path
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Image src={item.img} alt={item.name} width={32} height={32} />
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
