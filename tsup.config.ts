import { copyFile, mkdir } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', core: 'src/core/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  target: 'es2022',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-pdf', 'string-best-match'],
  async onSuccess() {
    await mkdir('dist', { recursive: true });
    await copyFile('src/styles.css', 'dist/styles.css');
  },
});
