import React, { useEffect, useState, useRef } from 'react';
import { YearPicker } from './YearPicker';
import { API_BASE_URL } from '../api';

export function Books({ books, setBooks }: { books: any[]; setBooks: (b: any[]) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [books]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [authors, setAuthors] = useState<Array<{id:number,name:string}>>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [books]);

  useEffect(() => {
    if (showEditModal && editingId !== null) {
      setAuthorsLoading(true);
  fetch(`${API_BASE_URL}/authors`)
        .then(res => res.json())
        .then(setAuthors)
        .catch(() => setAuthorsError('Failed to load authors'))
        .finally(() => setAuthorsLoading(false));
      // Focus the title input when editing starts
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [showEditModal, editingId]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBooks(books.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete book');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  // Inline edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/books/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editData.title,
          authorId: Number(editData.authorId),
          description: editData.description,
          publishedYear: editData.publishedYear ? Number(editData.publishedYear) : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update book');
      const updated = await res.json();
      setBooks(books.map(b => b.id === editingId ? updated : b));
      setEditingId(null);
      setEditData({});
      setShowEditModal(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 1800);
    } catch {
      setEditError('Failed to update book');
    } finally {
      setEditLoading(false);
    }
  };

  // Keyboard shortcuts for edit form
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditData({});
      setEditError(null);
      setShowEditModal(false);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Allow Ctrl+Enter to submit
      (e.target as HTMLFormElement).form?.requestSubmit();
    }
  };

  // Debounced server-side search
  useEffect(() => {
    const controller = new AbortController();
    setSearching(true);
    const timeout = setTimeout(() => {
  fetch(`${API_BASE_URL}/books${search ? `?search=${encodeURIComponent(search)}` : ''}`, { signal: controller.signal })
        .then(res => res.json())
        .then(setBooks)
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-300">Books</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-purple-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Search books..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {searching && (
        <div className="flex justify-center items-center mb-2">
          <span className="inline-block w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
          <span className="ml-2 text-purple-300 text-sm">Searching...</span>
        </div>
      )}
      <div
        className="overflow-y-auto rounded-lg mx-auto custom-scrollbar px-2 md:px-4"
        style={{
          maxHeight: '60vh',
          minHeight: '120px',
          width: '100%',
          maxWidth: '700px',
        }}
      >
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
              <React.Fragment key={b.id}>
                <li
                  className={`flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all border border-purple-900/40`}
                >
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg text-purple-300 drop-shadow-sm tracking-wide">{b.title}</div>
                    <div className="text-sm text-purple-100/80 italic mt-1">{b.description}</div>
                    <div className="text-xs text-purple-400 mt-2">Published: {b.published_year || 'N/A'}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="px-4 py-2 rounded bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow transition-all"
                      onClick={() => {
                        setEditingId(b.id);
                        setEditData({
                          title: b.title,
                          authorId: b.author_id || b.authorId || '',
                          description: b.description || '',
                          publishedYear: b.published_year || b.publishedYear || '',
                        });
                        setEditError(null);
                        setShowEditModal(true);
                      }}
                      disabled={deletingId !== null || editingId !== null}
                    >Edit</button>
                    <button
                      className={`px-4 py-2 rounded bg-gradient-to-r from-red-700 via-red-600 to-pink-600 text-white font-semibold hover:from-pink-600 hover:to-red-700 shadow transition-all ${deletingId === b.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => setConfirmId(b.id)}
                      disabled={deletingId === b.id || editingId !== null}
                    >
                      {deletingId === b.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
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
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">Edit Book</h3>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleEditSubmit}
                    onKeyDown={handleEditKeyDown}
                    style={{ position: 'relative' }}
                  >
                    <input
                      ref={titleInputRef}
                      className="border p-2 rounded bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 outline-yellow-400"
                      value={editData.title || ''}
                      onChange={e => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Title"
                      required
                    />
                    {authorsLoading ? (
                      <span className="text-gray-400 text-sm">Loading authors...</span>
                    ) : authorsError ? (
                      <span className="text-red-400 text-sm">{authorsError}</span>
                    ) : (
                      <select
                        className="border p-2 rounded bg-gray-800 text-gray-100 border-gray-700"
                        value={editData.authorId || ''}
                        onChange={e => setEditData({ ...editData, authorId: e.target.value })}
                        required
                      >
                        <option value="">Select author</option>
                        {authors.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    )}
                    <input
                      className="border p-2 rounded bg-gray-800 text-gray-100 border-gray-700"
                      value={editData.description || ''}
                      onChange={e => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Description"
                    />
                    <YearPicker value={editData.publishedYear ? String(editData.publishedYear) : ''} onChange={y => setEditData({ ...editData, publishedYear: y })} minYear={1900} />
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
      {editSuccess && <div className="text-green-400 text-sm mt-2 animate-fadein">Book updated!</div>}
    </div>
  );
}

/* Add this to the bottom of the file for custom scrollbar styles */
// You may need to add this to your global CSS if not using Tailwind plugin
// But for inline style, add this in a <style jsx> block if using Next.js, or in your main CSS:
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #7c3aed; // purple-700
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937; // gray-800
}
*/
