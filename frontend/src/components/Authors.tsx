import React, { useEffect, useState } from 'react';
import { AuthorForm } from './AuthorForm';

export function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/authors')
      .then(res => res.json())
      .then(setAuthors)
      .catch(() => setError('Failed to load authors'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading authors...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (authors.length === 0) return <div>No authors found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Authors</h2>
      <AuthorForm onCreated={a => setAuthors([...authors, a])} />
      <ul className="space-y-2 mt-4">
        {authors.map(a => (
          <li key={a.id} className="p-2 bg-white rounded shadow">
            <div className="font-bold">{a.name}</div>
            <div className="text-sm text-gray-600">{a.bio}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
