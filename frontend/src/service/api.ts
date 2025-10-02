// src/service/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchBooks(signal?: AbortSignal) {
  const res = await fetch(`${API_BASE_URL}/books`, { signal });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchAuthors(signal?: AbortSignal) {
  const res = await fetch(`${API_BASE_URL}/authors`, { signal });
  if (!res.ok) throw new Error('Failed to fetch authors');
  return res.json();
}

export async function searchBooks(search: string, signal?: AbortSignal) {
  const res = await fetch(`${API_BASE_URL}/books?search=${encodeURIComponent(search)}`, { signal });
  if (!res.ok) throw new Error('Failed to search books');
  return res.json();
}

export async function searchAuthors(search: string, signal?: AbortSignal) {
  const res = await fetch(`${API_BASE_URL}/authors?search=${encodeURIComponent(search)}`, { signal });
  if (!res.ok) throw new Error('Failed to search authors');
  return res.json();
}

export async function deleteBook(id: number) {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
  return res.json();
}

export async function deleteAuthor(id: number) {
  const res = await fetch(`${API_BASE_URL}/authors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete author');
  return res.json();
}

export async function updateBook(id: number, data: any) {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return res.json();
}

export async function updateAuthor(id: number, data: any) {
  const res = await fetch(`${API_BASE_URL}/authors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update author');
  return res.json();
}

export async function createBook(data: any) {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
}

export async function createAuthor(data: any) {
  const res = await fetch(`${API_BASE_URL}/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create author');
  return res.json();
}
