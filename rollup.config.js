import { uglify } from 'rollup-plugin-uglify';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import polyfill from 'rollup-plugin-polyfill';
import tsconfig from './src/tsconfig.json';
import pkg from './package.json';

delete tsconfig.compilerOptions.declaration;
delete tsconfig.compilerOptions.declarationDir;
delete tsconfig.compilerOptions.outDir;

const banner = `
/*!
 * mdui ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

export default [
  // Compile and test ES6 modules
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'es',
      file: './dist/js/mdui.esm.js',
    },
    plugins: [resolve(), typescript(tsconfig.compilerOptions)],
  },

  // Compile UMD modules
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/js/mdui.js',
    },
    plugins: [
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
    ],
  },

  // Compile and minify UMD modules
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/js/mdui.min.js',
    },
    plugins: [
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
      uglify({
        output: {
          preamble: banner,
        },
      }),
    ],
  },
];
