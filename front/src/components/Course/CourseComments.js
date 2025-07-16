'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function CourseComments() {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем комментарии при монтировании
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/courses/${slug}/comments/`
      );
      if (!res.ok) throw new Error('Не удалось получить комментарии');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Отправка нового комментария
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `http://localhost:8000/api/courses/${slug}/comments/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newText }),
        }
      );
      if (!res.ok) throw new Error('Не удалось отправить комментарий');
      setNewText('');
      await fetchComments(); // обновляем список
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="Ask a question or leave feedback…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting…' : 'Post Comment'}
        </button>
      </form>

      {/* Список комментариев */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500">Будьте первым, кто задаст вопрос.</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-800 mr-2">
                {c.author_name || 'You'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
