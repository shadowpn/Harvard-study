'use client';
import Image from 'next/image';

export default function Logo({ className = 'relative w-40 h-24 sm:w-48 sm:h-24' }) {
  return (
    <div className={className}>
      <Image
        src="/img/Logo_sense.png"
        alt="StudyHub Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
