// components/Course/CourseVideoPlayer.js
'use client';

export default function CourseVideoPlayer({ videoUrl }) {
  return (
    <div className="mb-8">
      <video
        src={videoUrl}
        controls
        preload="metadata"
        crossOrigin="anonymous"
        className="w-full rounded-xl shadow-lg"
      />
    </div>
  );
}
