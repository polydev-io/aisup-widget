import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'AISupportWidget',
      fileName: 'widget',
      formats: ['iife']
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'widget.[ext]'
      }
    }
  },
  server: {
    port: 5173,
    open: '/demo.html'
  }
});
