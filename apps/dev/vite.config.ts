import { defineConfig } from 'vite';
import path from 'path';
import postcssLit from 'rollup-plugin-postcss-lit';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [postcssLit()],
  resolve: {
    alias: [
      {
        find: '@crux/async-queue',
        replacement: path.resolve(__dirname, '../../packages/async-queue/src/index.ts'),
      },
      {
        find: '@crux/dynamic-store',
        replacement: path.resolve(__dirname, '../../packages/dynamic-store/src/index.ts'),
      },
      {
        find: '@crux/event-emitter',
        replacement: path.resolve(__dirname, '../../packages/event-emitter/src/index.ts'),
      },
      {
        find: '@crux/query',
        replacement: path.resolve(__dirname, '../../packages/query/src/index.ts'),
      },
      {
        find: '@crux/redux-registry',
        replacement: path.resolve(__dirname, '../../packages/redux-registry/src/index.ts'),
      },
      {
        find: '@crux/slice',
        replacement: path.resolve(__dirname, '../../packages/slice/src/index.ts'),
      },
      {
        find: '@crux/redux-types',
        replacement: path.resolve(__dirname, '../../packages/redux-types/src/index.ts'),
      },
      {
        find: '@crux/string-utils',
        replacement: path.resolve(__dirname, '../../packages/string-utils/src/index.ts'),
      },
      {
        find: '@crux/utils',
        replacement: path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      },
      {
        find: '@crux/crux',
        replacement: path.resolve(__dirname, '../../packages/crux/src/index.ts'),
      },
    ],
  },
});
