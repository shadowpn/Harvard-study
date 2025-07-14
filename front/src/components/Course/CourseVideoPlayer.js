// components/Course/CourseVideoPlayer.js
export default function CourseVideoPlayer({ videoUrl }) {
    return (
      <div className="w-full h-[700px] mb-8">
        <iframe
          className="w-full h-full rounded-xl shadow-md"
          src={videoUrl}
          title="Course video"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  