'use client';

export default function FormattedText({ text, className = ' ' }) {
  return (
    <div
      className={`whitespace-pre-wrap break-words text-sm sm:text-base font-sans ${className}`}
    >
      {text}
    </div>
  );
}
