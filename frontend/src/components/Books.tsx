import React, { useEffect, useState } from 'react';

export function Books({ books, setBooks }: { books: any[]; setBooks: (b: any[]) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [books]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBooks(books.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete book');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
  <h2 className="text-2xl font-bold text-center mb-4 text-purple-300">Books</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="inline-block w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-400">No books found.</div>
      ) : (
        <ul className="space-y-4">
          {books.map(b => (
            <li key={b.id} className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all border border-purple-900/40">
              <div className="flex-1 text-left">
                <div className="font-bold text-lg text-purple-300 drop-shadow-sm tracking-wide">{b.title}</div>
                <div className="text-sm text-purple-100/80 italic mt-1">{b.description}</div>
                <div className="text-xs text-purple-400 mt-2">Published: {b.published_year || 'N/A'}</div>
              </div>
              <button
                className={`ml-4 mt-2 md:mt-0 px-4 py-2 rounded bg-gradient-to-r from-red-700 via-red-600 to-pink-600 text-white font-semibold hover:from-pink-600 hover:to-red-700 shadow transition-all ${deletingId === b.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setConfirmId(b.id)}
                disabled={deletingId === b.id}
              >
                {deletingId === b.id ? 'Deleting...' : 'Delete'}
              </button>
              {confirmId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto text-center">
                    <h3 className="text-lg font-bold mb-2 text-purple-700">Confirm Delete</h3>
                    <p className="mb-4 text-gray-600">Are you sure you want to delete this book?</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                        onClick={() => setConfirmId(null)}
                        disabled={deletingId === confirmId}
                      >Cancel</button>
                      <button
                        className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                        onClick={() => handleDelete(confirmId!)}
                        disabled={deletingId === confirmId}
                      >{deletingId === confirmId ? 'Deleting...' : 'Delete'}</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
