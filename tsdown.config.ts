import { defineConfig } from 'tsdown'

export default defineConfig({
   entry: ['src/index.tsx'],
   platform:'neutral',
   sourcemap: true,
   clean: true,
   dts: true,
   format: ['cjs', 'esm'],
   minify: true,
   shims: true,
   outDir: 'dist',
   target: 'esnext',
   treeshake: true,
   tsconfig: './tsconfig.json',
})
