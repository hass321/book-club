import React, { useState } from 'react';

function Spinner() {
  return (
    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"></span>
  );
}

export function AuthorForm({ onCreated }: { onCreated: (a: any) => void }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isNameInvalid = submitted && name.trim() === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (name.trim() === '') {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      });

      if (!res.ok) throw new Error('Failed to create author');

      const newAuthor = await res.json();
      onCreated(newAuthor);

      // reset form
      setName('');
      setBio('');
      setSubmitted(false);
    } catch {
      setError('Failed to create author');
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
          Name<span className="text-red-500">*</span>
        </label>
        <input
          className={`border p-2 rounded focus:ring-purple-400 ${
            isNameInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Bio</label>
        <input
          className="border border-gray-300 p-2 rounded focus:ring-purple-400"
          placeholder="Bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow transition-all duration-150 w-full max-w-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Add Author'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-center animate-shake">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
    </form>
  );
}
