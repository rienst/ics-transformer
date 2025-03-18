import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  noExternal: [/(.*)/],
  splitting: false,
  sourcemap: true,
  clean: true,
})
