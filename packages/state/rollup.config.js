import cleanup from 'rollup-plugin-cleanup';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const extensions = ['.ts'];
export default [
  {
    input: 'src/lib/index.ts',
    output: { file: pkg.module, format: 'es', exports: 'named', sourcemap: true },
    plugins: [
      nodeResolve({
        extensions,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript(),
      cleanup({
        comments: 'none',
        extensions,
      }),
    ],
  },
];