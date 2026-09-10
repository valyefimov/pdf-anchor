import { copyFile, mkdir } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', core: 'src/core/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  target: 'es2022',
  // string-best-match 1.1.1 ships extensionless ESM imports that Node cannot resolve,
  // so it is bundled instead of being left as a runtime dependency.
  noExternal: ['string-best-match'],
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-pdf'],
  async onSuccess() {
    await mkdir('dist', { recursive: true });
    await copyFile('src/styles.css', 'dist/styles.css');
  },
});
