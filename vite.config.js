import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        widget: resolve(__dirname, 'src/widget.js'),
        react: resolve(__dirname, 'src/react.tsx')
      },
      name: 'AISupportWidget'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: [
        {
          format: 'iife',
          name: 'AISupportWidget',
          entryFileNames: 'widget.iife.js',
          assetFileNames: 'widget.[ext]',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'React'
          }
        },
        {
          format: 'es',
          entryFileNames: '[name].esm.js',
          assetFileNames: 'widget.[ext]'
        },
        {
          format: 'umd',
          name: 'AISupportWidget',
          entryFileNames: '[name].umd.js',
          assetFileNames: 'widget.[ext]',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'React'
          }
        }
      ]
    }
  },
  server: {
    port: 5173,
    open: '/demo.html'
  }
});
