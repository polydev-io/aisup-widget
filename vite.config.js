import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.js'),
      name: 'AISupportWidget',
      fileName: (format) => `widget.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'widget.[ext]',
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  server: {
    port: 5173,
    open: '/demo.html'
  }
});
