import React, { useState } from 'react';
import { YearPicker } from './YearPicker';

function Spinner() {
  return (
    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"></span>
  );
}

export function BookForm({ onCreated }: { onCreated: (b: any) => void }) {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isTitleInvalid = submitted && title.trim() === '';
  const isAuthorIdInvalid = submitted && authorId.trim() === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isTitleInvalid || isAuthorIdInvalid) {
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

      const newBook = await res.json();
      onCreated(newBook);

      // reset form
      setTitle('');
      setAuthorId('');
      setDescription('');
      setPublishedYear('');
      setSubmitted(false);
    } catch {
      setError('Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mb-4 w-full max-w-md mx-auto flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          className={`border p-2 rounded focus:ring-2 focus:ring-purple-400 ${
            isTitleInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">
          Author ID<span className="text-red-500">*</span>
        </label>
        <input
          className={`border p-2 rounded focus:ring-2 focus:ring-purple-400 ${
            isAuthorIdInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Author ID"
          value={authorId}
          onChange={e => setAuthorId(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Description</label>
        <input
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Published Year</label>
        <YearPicker value={publishedYear} onChange={setPublishedYear} minYear={1900} />
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold shadow transition-all duration-150 w-full max-w-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Add Book'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-center">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
    </form>
  );
}
