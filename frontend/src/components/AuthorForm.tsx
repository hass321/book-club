import React, { useState } from 'react';

export function AuthorForm({ onCreated }: { onCreated: (a: any) => void }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
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
      const data = await res.json();
      onCreated(data);
      setName('');
      setBio('');
    } catch {
      setError('Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-4 w-full max-w-md mx-auto flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Name</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Bio</label>
        <input
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          placeholder="Bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow transition-all duration-150 w-full max-w-xs"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Author'}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </form>
  );
}
