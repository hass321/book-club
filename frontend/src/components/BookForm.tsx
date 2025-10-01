import React, { useState, useEffect } from 'react';
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
  const [authors, setAuthors] = useState<Array<{id:number,name:string}>>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState<string|null>(null);

  useEffect(() => {
    setAuthorsLoading(true);
    fetch('/authors')
      .then(res => res.json())
      .then(setAuthors)
      .catch(() => setAuthorsError('Failed to load authors'))
      .finally(() => setAuthorsLoading(false));
  }, []);

  const isTitleInvalid = submitted && title.trim() === '';
  const isAuthorIdInvalid = submitted && authorId.trim() === '';

  function validateFields() {
    return {
      title: title.trim() === '',
      authorId: authorId.trim() === '',
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const errors = validateFields();
    if (errors.title || errors.authorId) {
      setError('Title and Author Name are required!');
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
      className="mb-4 w-full max-w-md mx-auto flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow text-gray-100"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
  <label className="font-medium text-gray-200">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 bg-gray-900 text-gray-100 placeholder-gray-400 ${
            isTitleInvalid ? 'border-red-500' : 'border-gray-700'
          }`}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
  <label className="font-medium text-gray-200">
          Author Name<span className="text-red-500">*</span>
        </label>
        {authorsLoading ? (
          <div className="text-gray-400 text-sm">Loading authors...</div>
        ) : authorsError ? (
          <div className="text-red-400 text-sm">{authorsError}</div>
        ) : (
          <select
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 bg-gray-900 text-gray-100 placeholder-gray-400 ${isAuthorIdInvalid ? 'border-red-500' : 'border-gray-700'}`}
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
          >
            <option value="">Select author</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-2">
  <label className="font-medium text-gray-200">Description</label>
        <input
          className="border border-gray-700 p-2 rounded focus:ring-2 focus:ring-purple-500 bg-gray-900 text-gray-100 placeholder-gray-400"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
  <label className="font-medium text-gray-200">Published Year</label>
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
