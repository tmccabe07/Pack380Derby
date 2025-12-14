import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/lib/api/**/__tests__/**/*.spec.ts'],
    exclude: ['src/lib/api/cars.spec.ts'],
    coverage: {
      reporter: ['text', 'html'],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
