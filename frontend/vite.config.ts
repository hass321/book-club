import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/authors': 'https://bookclub.up.railway.app',
      '/books': 'https://bookclub.up.railway.app',
    },
  },
});