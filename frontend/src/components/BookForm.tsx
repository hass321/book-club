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
    <form className="mb-4 w-full max-w-md mx-auto flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Title</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Author ID</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Author ID"
          value={authorId}
          onChange={e => setAuthorId(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Description</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Published Year</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Published Year"
          value={publishedYear}
          onChange={e => setPublishedYear(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold shadow transition-all duration-150 w-full max-w-xs"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Book'}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </form>
  );
}
