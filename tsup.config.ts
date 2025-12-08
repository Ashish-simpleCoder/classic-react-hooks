import { defineConfig } from 'tsup'

export default defineConfig({
   entry: ['src/index.tsx'],
   splitting: true,
   sourcemap: true,
   clean: true,
   dts: true,
   format: ['cjs', 'esm'],
   minify: 'terser',
   shims: true,
   outDir: 'dist',
   target: 'esnext',
   treeshake: true,
   jsxFragment: 'React.Fragment',
   metafile: true,
   tsconfig: './tsconfig.json',
})
