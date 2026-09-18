import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],

  format: ['esm', 'cjs'],

  target: 'node22',

  dts: true,

  sourcemap: true,

  clean: true,

  splitting: false,

  minify: false,

  outDir: 'dist',

  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.js' : '.cjs',
    };
  },
});
