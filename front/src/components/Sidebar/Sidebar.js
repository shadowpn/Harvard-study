'use client';
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
    <aside
      className={`
        fixed z-50 bg-white shadow-lg
        md:top-[60px] md:left-0 md:w-60 md:h-[calc(100vh-60px)]
        bottom-0 left-0 w-full h-16
        flex md:block items-center justify-around
      `}
    >
      {/* Welcome block (desktop only) */}
      {userData && (
        <div className="hidden md:flex items-center gap-1 p-4">
          <Image
            src="/icons/aсtive.png"
            alt="greeting icon"
            width={30}
            height={30}
            className="inline-block"
          />
          <p className="text-sm text-gray-500 text-center font-bold">
            Welcome, {userData.first_name}
          </p>          
        </div>
      )}

      {/* Nav menu */}
      <nav className="flex flex-row md:flex-col w-full md:space-y-2 justify-around md:justify-start">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`
              flex flex-col items-center justify-center gap-1 p-2 md:flex-row md:items-start md:justify-start md:px-4 md:py-2
              ${pathname === item.path
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <Image src={item.img} alt={item.name} width={24} height={24} />
            <span className="hidden md:inline">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
