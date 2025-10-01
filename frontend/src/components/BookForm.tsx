import React, { useState } from 'react';

export function BookForm({ onCreated }: { onCreated: (b: any) => void }) {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorId) {
      setError('Title and Author ID are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          authorId: Number(authorId),
          description,
          publishedYear: publishedYear ? Number(publishedYear) : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to create book');
      const data = await res.json();
      onCreated(data);
      setTitle('');
      setAuthorId('');
      setDescription('');
      setPublishedYear('');
    } catch {
      setError('Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <input
        className="border p-2 mr-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        className="border p-2 mr-2"
        placeholder="Author ID"
        value={authorId}
        onChange={e => setAuthorId(e.target.value)}
        required
      />
      <input
        className="border p-2 mr-2"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        placeholder="Published Year"
        value={publishedYear}
        onChange={e => setPublishedYear(e.target.value)}
        type="number"
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Add Book'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
