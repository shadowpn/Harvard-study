'use client';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from "@/components/Logo";
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userData');
    router.push('/auth');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Центр – логотип */}
        <div className={styles.logoCenter}>
          <Logo className="relative w-36 h-20" />
        </div>

        {/* Справа – аватар и выход */}
        <div className={styles.right}>
          <div className={styles.avatar} onClick={() => router.push('/dashboard')}>
            <Image
              src="/icons/aсtive.png"
              alt="User"
              width={32}
              height={32}
              className={styles.icon}
            />
          </div>
          <Image
            src="/icons/logOut.png"
            alt="Logout"
            width={32}
            height={32}
            title="Logout"
            onClick={handleLogout}
            className={styles.icon}
          />
        </div>
      </nav>
    </header>
  );
}