import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/stores/cart-store.ts',
        'src/stores/ui-store.ts',
        'src/hooks/use-debounce.ts',
        'src/hooks/use-local-storage.ts',
        'src/hooks/use-mounted.ts',
        'src/lib/utils.ts',
        'src/app/api/health/route.ts',
        'src/app/api/ai/chat/route.ts',
      ],
      exclude: ['src/lib/mock-data.ts'],
      thresholds: {
        lines: 65,
        functions: 65,
        branches: 55,
        statements: 65,
      },
    },
  },
});
