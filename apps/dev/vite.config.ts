import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      { find: '@crux/app', replacement: path.resolve(__dirname, '../../packages/app/src/index.ts') },
      { find: '@crux/async-queue', replacement: path.resolve(__dirname, '../../packages/async-queue/src/index.ts') },
      { find: '@crux/create-store', replacement: path.resolve(__dirname, '../../packages/create-store/src/index.ts') },
      { find: '@crux/di', replacement: path.resolve(__dirname, '../../packages/di/src/index.ts') },
      { find: '@crux/event-emitter', replacement: path.resolve(__dirname, '../../packages/event-emitter/src/index.ts') },
      { find: '@crux/machine', replacement: path.resolve(__dirname, '../../packages/machine/src/index.ts') },
      { find: '@crux/redux-machine', replacement: path.resolve(__dirname, '../../packages/redux-machine/src/index.ts') },
      { find: '@crux/query', replacement: path.resolve(__dirname, '../../packages/query/src/index.ts') },
      { find: '@crux/redux-registry', replacement: path.resolve(__dirname, '../../packages/redux-registry/src/index.ts') },
      { find: '@crux/redux-router', replacement: path.resolve(__dirname, '../../packages/redux-router/src/index.ts') },
      { find: '@crux/redux-slice', replacement: path.resolve(__dirname, '../../packages/redux-slice/src/index.ts') },
      { find: '@crux/redux-types', replacement: path.resolve(__dirname, '../../packages/redux-types/src/index.ts') },
      { find: '@crux/router', replacement: path.resolve(__dirname, '../../packages/router/src/index.ts') },
      { find: '@crux/set-utils', replacement: path.resolve(__dirname, '../../packages/set-utils/src/index.ts') },
      { find: '@crux/string-utils', replacement: path.resolve(__dirname, '../../packages/string-utils/src/index.ts') },
      { find: '@crux/sync-queue', replacement: path.resolve(__dirname, '../../packages/sync-queue/src/index.ts') },
      { find: '@crux/url-parser', replacement: path.resolve(__dirname, '../../packages/url-parser/src/index.ts') },
      { find: '@crux/utils', replacement: path.resolve(__dirname, '../../packages/utils/src/index.ts') },
      { find: '@crux/xapp', replacement: path.resolve(__dirname, '../../packages/xapp/src/index.ts') },
    ],
  },
});
