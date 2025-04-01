import { defineConfig } from 'tsup'

export default defineConfig(options => {
  console.log(options)

  return {
    entry: [
      options['--'].includes('standalone')
        ? 'src/standalone.ts'
        : 'src/index.ts',
    ],
    noExternal: [/(.*)/],
    splitting: false,
    sourcemap: true,
    clean: true,
  }
})
