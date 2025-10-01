import React, { useEffect, useState } from 'react';

export function Authors({ authors, setAuthors }: { authors: any[]; setAuthors: (a: any[]) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [authors]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/authors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAuthors(authors.filter((a: {id:number}) => a.id !== id));
    } catch {
      alert('Failed to delete author');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">Authors</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="inline-block w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : authors.length === 0 ? (
        <div className="text-center text-gray-400">No authors found.</div>
      ) : (
        <ul className="space-y-4">
          {authors.map((a: {id:number,name:string,bio?:string}) => (
            <li key={a.id} className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all">
              <div className="flex-1 text-left">
                <div className="font-bold text-lg text-purple-800">{a.name}</div>
                <div className="text-sm text-gray-600">{a.bio}</div>
              </div>
              <button
                className={`ml-4 mt-2 md:mt-0 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-all ${deletingId === a.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setConfirmId(a.id)}
                disabled={deletingId === a.id}
              >
                {deletingId === a.id ? 'Deleting...' : 'Delete'}
              </button>
              {confirmId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto text-center">
                    <h3 className="text-lg font-bold mb-2 text-purple-700">Confirm Delete</h3>
                    <p className="mb-4 text-gray-600">Are you sure you want to delete this author?</p>
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
