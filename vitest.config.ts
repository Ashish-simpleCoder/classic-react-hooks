/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   plugins: [react()],
   test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test.setup.ts'],
      coverage: {
         provider: 'istanbul', // or 'c8'
         clean: true,
         all: false,
      },
      include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
         '**/node_modules/**',
         '**/dist/**',
         '**/cypress/**',
         '**/.{idea,git,cache,output,temp}/**',
         './src/config/**',
         './scripts/*',
      ],
   },
   clearScreen: true,
})
