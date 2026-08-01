import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Disables source maps for maximum security & smallest payload
    cssCodeSplit: true, // Splits CSS into lightweight per-page chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'vendor-editor'; // Separate heavy Monaco editor chunk (loaded only on workspace)
            }
            if (id.includes('reactflow')) {
              return 'vendor-graph'; // Separate 2D canvas chunk
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'; // Separate icons chunk
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-core'; // Lightweight core React runtime
            }
            if (id.includes('jszip') || id.includes('socket.io-client')) {
              return 'vendor-utils';
            }
            return 'vendor-libs';
          }
        },
      },
    },
  },
});