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
         all: true,
         include: ['src/lib/**/*'],
         exclude: ['src/lib/use-combined-key-event-listener'],
      },
      include: ['src/lib/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      exclude: [
         '**/node_modules/**',
         '**/dist/**',
         '**/cypress/**',
         '**/.{idea,git,cache,output,temp}/**',
         './src/config/**',
         './scripts/*',
         './apps/*',
      ],
   },
   clearScreen: true,
})
