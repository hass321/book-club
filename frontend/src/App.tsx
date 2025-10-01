import React, { useState, useEffect } from 'react';
import { Authors } from './components/Authors';
import { Books } from './components/Books';
import { BookForm } from './components/BookForm';
import { AuthorForm } from './components/AuthorForm';

const App = () => {
  const [tab, setTab] = useState<'book' | 'author'>('book');
  const [listTab, setListTab] = useState<'book' | 'author'>('book');
  const [books, setBooks] = useState<any[]>([]);
  const [booksLoaded, setBooksLoaded] = useState(false);
  const [authors, setAuthors] = useState<any[]>([]);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);

  useEffect(() => {
    if (!booksLoaded) {
      fetch('/books')
        .then(res => res.json())
        .then(setBooks)
        .finally(() => setBooksLoaded(true));
    }
    if (!authorsLoaded) {
      fetch('/authors')
        .then(res => res.json())
        .then(setAuthors)
        .finally(() => setAuthorsLoaded(true));
    }
  }, [booksLoaded, authorsLoaded]);

  const handleBookCreated = (newBook: any) => {
    setBooks(prev => [...prev, newBook]);
    setListTab('book');
  };

  const handleAuthorCreated = (newAuthor: any) => {
    setAuthors(prev => [...prev, newAuthor]);
    setListTab('author');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center px-2 py-4">
      <header className="w-full mb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-purple-700 drop-shadow mb-2">Book Club</h1>
          <p className="text-center text-gray-500">A modern, responsive book club app</p>
        </div>
      </header>
      <main className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <section className="flex-1 mb-8 md:mb-0">
            <div className="flex justify-center mb-4">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-300 focus:outline-none hover:bg-purple-700 hover:text-white ${listTab === 'book' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 border-b-2 border-purple-600'}`}
                style={{ transition: 'background 0.3s, color 0.3s' }}
                onClick={() => setListTab('book')}
              >
                Books List
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-300 focus:outline-none hover:bg-purple-700 hover:text-white ${listTab === 'author' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 border-b-2 border-purple-600'}`}
                style={{ transition: 'background 0.3s, color 0.3s' }}
                onClick={() => setListTab('author')}
              >
                Authors List
              </button>
            </div>
            <div className="bg-white rounded-b-lg shadow p-6 transition-all duration-300" style={{ minHeight: '200px' }}>
              <div className={`transition-opacity duration-300 ${listTab === 'book' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                {listTab === 'book' && <Books books={books} setBooks={setBooks} />}
              </div>
              <div className={`transition-opacity duration-300 ${listTab === 'author' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                {listTab === 'author' && <Authors authors={authors} setAuthors={setAuthors} />}
              </div>
            </div>
          </section>
          <section className="flex-1">
            <div className="flex justify-center mb-4">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-150 focus:outline-none ${tab === 'book' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-b-2 border-purple-600'}`}
                onClick={() => setTab('book')}
              >
                Add Book
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-150 focus:outline-none ${tab === 'author' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-b-2 border-purple-600'}`}
                onClick={() => setTab('author')}
              >
                Add Author
              </button>
            </div>
            <div className="bg-white rounded-b-lg shadow p-6">
              {tab === 'book' ? <BookForm onCreated={handleBookCreated} /> : <AuthorForm onCreated={handleAuthorCreated} />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
