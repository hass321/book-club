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
    <form className="mb-4" onSubmit={handleSubmit}>
      <input
        className="border p-2 mr-2"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        className="border p-2 mr-2"
        placeholder="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Add Author'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
