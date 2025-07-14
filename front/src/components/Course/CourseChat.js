// components/Course/CourseChat.js
import { useEffect, useState } from 'react';

export default function CourseChat({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    async function fetchChat() {
      const res = await fetch(`/api/courses/${courseId}/chat`);
      const data = await res.json();
      setMessages(data);
    }
    fetchChat();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const res = await fetch(`/api/courses/${courseId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: question }),
    });

    const newMessage = await res.json();
    setMessages([...messages, newMessage]);
    setQuestion('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Questions & Answers</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="w-full border rounded px-3 py-2"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
      </form>
      <div className="space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="bg-white p-3 rounded shadow">
            <p className="font-semibold">{msg.user}</p>
            <p className="text-gray-700">{msg.text}</p>
            {msg.reply && (
              <div className="mt-2 ml-4 border-l-2 pl-2 text-sm text-gray-600">
                <strong>Instructor:</strong> {msg.reply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
