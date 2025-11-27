import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        widget: resolve(__dirname, 'src/widget.js'),
        react: resolve(__dirname, 'src/react.tsx')
      },
      name: 'AISupportWidget',
      formats: ['es', 'umd', 'iife']
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: [
        {
          format: 'iife',
          name: 'AISupportWidget',
          entryFileNames: 'widget.iife.js',
          assetFileNames: 'widget.[ext]',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        },
        {
          format: 'es',
          entryFileNames: '[name].esm.js',
          assetFileNames: 'widget.[ext]',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        },
        {
          format: 'umd',
          name: 'AISupportWidget',
          entryFileNames: '[name].umd.js',
          assetFileNames: 'widget.[ext]',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
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
