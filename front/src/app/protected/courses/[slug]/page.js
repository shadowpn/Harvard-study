'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function CourseDetailPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    fetch(`http://localhost:8000/api/courses/${slug}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch course")
        return res.json()
      })
      .then(data => setCourse(data))
      .catch(err => setError(err.message))
  }, [slug])

  if (error) return <p className="text-red-500">{error}</p>
  if (!course) return <p>Загрузка...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <img src={course.image} alt={course.alt} className="w-full max-h-[400px] object-cover mb-4" />
      <p className="mb-2">{course.description}</p>
      <p>🕒 Длительность: {course.duration}</p>
      <p>📅 Старт: {course.start_date}</p>
      <p>💰 Цена: ${course.price}</p>
    </div>
  )
}
