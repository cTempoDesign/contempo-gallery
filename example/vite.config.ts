import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The gallery source lives outside this app; force one React copy or hooks break
    dedupe: ['react', 'react-dom'],
    alias: {
      '@ctempodesign/contempo-gallery': path.resolve(__dirname, '../src')
    }
  }
});