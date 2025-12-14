// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup/vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 1000 * 30,
    clearMocks: true,
    restoreMocks: true,
  },
})
