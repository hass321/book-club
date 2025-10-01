import React, { useEffect, useState } from 'react';
import { BookForm } from './BookForm';

export function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/books')
      .then(res => res.json())
      .then(setBooks)
      .catch(() => setError('Failed to load books'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (books.length === 0) return <div>No books found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Books</h2>
      <BookForm onCreated={b => setBooks([...books, b])} />
      <ul className="space-y-2 mt-4">
        {books.map(b => (
          <li key={b.id} className="p-2 bg-white rounded shadow">
            <div className="font-bold">{b.title}</div>
            <div className="text-sm text-gray-600">{b.description}</div>
            <div className="text-xs text-gray-400">Published: {b.published_year || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
