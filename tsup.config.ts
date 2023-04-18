import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './src/index.ts',
  ],
  format: 'cjs',
  minify: true,
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
})
