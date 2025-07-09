'use client';
import CourseCard from '@/components/CourseCard/CourseCard';

export default function StorePage() {
  const demoCourses = [
    {
      id: 1,
      title: 'Lash Extensions 101',
      description: 'Learn classic lash extensions from scratch...',
      image: '/img/lash1.jpg',
      rating: 4.8,
      price: 39.99,
      duration: 5,
      start_date: '2025-07-15',
    },
    {
      id: 2,
      title: 'Advanced Volume Training',
      description: 'Master volume techniques in this advanced course...',
      image: '/img/lash2.jpg',
      rating: 4.9,
      price: 59.99,
      duration: 8,
      start_date: '2025-08-01',
    },
    // добавим ещё позже
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {demoCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}
