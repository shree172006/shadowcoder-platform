import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Prevents Chrome DevTools from inspecting original source code tree
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'vendor-editor'; // Separate heavy Monaco editor chunk
            }
            if (id.includes('reactflow')) {
              return 'vendor-graph'; // Separate ReactFlow 2D canvas chunk
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'; // Separate icons chunk
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-core'; // Core React chunk
            }
            return 'vendor-libs';
          }
        },
      },
    },
  },
});