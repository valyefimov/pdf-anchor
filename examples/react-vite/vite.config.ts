import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// The demo imports `@efa/pdf-anchor` straight from the repository sources, so it always
// reflects your working tree. In your own app, install the package from npm instead.
export default defineConfig({
  // GitHub Pages serves the demo from /<repository>/, see .github/workflows/pages.yml.
  base: process.env.DEMO_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@efa/pdf-anchor/styles.css', replacement: root('../../src/styles.css') },
      { find: /^@efa\/pdf-anchor$/, replacement: root('../../src/index.ts') },
    ],
    dedupe: ['react', 'react-dom', 'react-pdf'],
  },
  server: { fs: { allow: [root('../..')] } },
});
