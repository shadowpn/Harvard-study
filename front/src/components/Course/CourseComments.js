'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { authorizedFetch } from '@/utils/authHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CourseComments() {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await authorizedFetch(`${BASE_URL}/courses/${slug}/comments/`);
      if (!res.ok) throw new Error('Не удалось получить комментарии');

      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];

      setComments(results);
    } catch (err) {
      console.error('Ошибка при загрузке комментариев:', err);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setLoading(true);
    try {
      const res = await authorizedFetch(
        `${BASE_URL}/courses/${slug}/comments/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newText }),
        }
      );

      if (!res.ok) throw new Error('Не удалось отправить комментарий');

      setNewText('');
      await fetchComments();
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке комментария');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>

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

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500">Be the first to ask a question</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-800 mr-2">
                {c.author || 'You'}
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
