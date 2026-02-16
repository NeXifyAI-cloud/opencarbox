import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/e2e/**/*.e2e.test.ts'],
    environment: 'node',
    passWithNoTests: false,
  },
});
