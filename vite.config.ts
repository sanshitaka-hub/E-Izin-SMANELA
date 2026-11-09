import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'copy-404-for-github-pages',
        closeBundle() {
          try {
            const distHtml = path.resolve(process.cwd(), 'dist/index.html');
            const dist404 = path.resolve(process.cwd(), 'dist/404.html');
            if (fs.existsSync(distHtml)) {
              fs.copyFileSync(distHtml, dist404);
            }
          } catch (e) {
            console.error('Could not copy index.html to 404.html', e);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('jsqr') || id.includes('qrcode')) {
                return 'vendor-qr';
              }
              if (id.includes('canvas-confetti')) {
                return 'vendor-effects';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
