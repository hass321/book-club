import React from 'react';
import { Authors } from './components/Authors';
import { Books } from './components/Books';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Book Club</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Authors />
        <Books />
      </div>
    </div>
  );
}
