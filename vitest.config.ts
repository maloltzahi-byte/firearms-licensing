import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/data\/(.*)$/,
        replacement: `${path.join(root, 'data')}/$1`,
      },
      {
        find: /^@\//,
        replacement: `${path.join(root, 'src')}/`,
      },
    ],
  },
  test: {
    environment: 'node',
  },
})
