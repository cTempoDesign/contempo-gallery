import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  // 'use client' banner lets Next.js App Router server components import this package directly
  output: [
    { file: 'dist/index.js', format: 'cjs', exports: 'named', sourcemap: true, banner: "'use client';" },
    { file: 'dist/index.esm.js', format: 'esm', exports: 'named', sourcemap: true, banner: "'use client';" }
  ],
  // Never bundle React; the consuming app provides it
  external: [/^react($|\/)/, /^react-dom($|\/)/],
  plugins: [
    typescript({ tsconfig: './tsconfig.build.json' }),
    postcss({ inject: true, extract: false, minimize: true })
  ]
};
