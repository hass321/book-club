import React, { useEffect, useRef, useState } from 'react';

export function Authors({ authors, setAuthors }: { authors: any[]; setAuthors: (a: any[]) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [authors]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (showEditModal && editingId !== null) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [showEditModal, editingId]);

  // Inline edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`/authors/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
        }),
      });
      if (!res.ok) throw new Error('Failed to update author');
      const updated = await res.json();
      setAuthors(authors.map(a => a.id === editingId ? updated : a));
      setEditingId(null);
      setEditData({});
      setShowEditModal(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 1800);
    } catch {
      setEditError('Failed to update author');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditData({});
      setEditError(null);
      setShowEditModal(false);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      (e.target as HTMLFormElement).form?.requestSubmit();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-300">Authors</h2>
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
            <React.Fragment key={a.id}>
              <li className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all border border-purple-900/40">
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg text-purple-300 drop-shadow-sm tracking-wide">{a.name}</div>
                  <div className="text-sm text-purple-100/80 italic mt-1">{a.bio}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="px-4 py-2 rounded bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow transition-all"
                    onClick={() => {
                      setEditingId(a.id);
                      setEditData({
                        name: a.name,
                        bio: a.bio || '',
                      });
                      setEditError(null);
                      setShowEditModal(true);
                    }}
                    disabled={deletingId !== null || editingId !== null}
                  >Edit</button>
                  <button
                    className={`px-4 py-2 rounded bg-gradient-to-r from-red-700 via-red-600 to-pink-600 text-white font-semibold hover:from-pink-600 hover:to-red-700 shadow transition-all ${deletingId === a.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setConfirmId(a.id)}
                    disabled={deletingId === a.id || editingId !== null}
                  >
                    {deletingId === a.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
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
            </React.Fragment>
          ))}
          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadein border-2 border-yellow-400">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
                  onClick={() => { setShowEditModal(false); setEditingId(null); setEditData({}); setEditError(null); }}
                  aria-label="Close"
                >&times;</button>
                <h3 className="text-xl font-bold text-yellow-300 mb-4">Edit Author</h3>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleEditSubmit}
                  onKeyDown={handleEditKeyDown}
                  style={{ position: 'relative' }}
                >
                  <input
                    ref={nameInputRef}
                    className="border p-2 rounded bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 outline-yellow-400"
                    value={editData.name || ''}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Name"
                    required
                  />
                  <input
                    className="border p-2 rounded bg-gray-800 text-gray-100 border-gray-700"
                    value={editData.bio || ''}
                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Bio"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold shadow transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={editLoading}
                    >
                      {editLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold shadow"
                      type="button"
                      onClick={() => { setShowEditModal(false); setEditingId(null); setEditData({}); setEditError(null); }}
                      disabled={editLoading}
                    >Cancel</button>
                  </div>
                  {editError && <div className="text-red-400 text-sm w-full mt-2">{editError}</div>}
                </form>
              </div>
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
