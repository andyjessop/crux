import './styles/variables.scss';
import './styles/normalise.css';
import './styles/main.scss';
import 'animate.css';
import { xapp } from '@crux/xapp';
import { toasterSlice, toasterView } from './features/toaster/toaster.index';
import { layoutSlice, layoutView } from './layout/layout.index';
import { routerSlice } from './shared/router/router.index';
import { darkModeSlice, darkModeView } from './features/dark-mode/dark-mode.index';
import { navView } from './features/nav/nav.index';
import { todosFetchInitiator, todosSlice, todosView } from './features/todos/todos.index';
import { dataSlice } from './shared/data/data.index';

main();

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw '#root element does not exist';
  }

  // If we're in development, start the mock server. This starts a ServiceWorker
  // which intercepts fetch requests and returns mocks according to the contents
  // of ./shared/mocks/handlers. See https://mswjs.io/ for more details.
  if (import.meta.env.DEV) {
    const { createServer } = await import('./shared/mock/server');

    (await createServer(import.meta.env.VITE_API_URL)).start({
      onUnhandledRequest: 'bypass',
      waitUntilReady: true,
    });
  }

  const slices = [dataSlice, layoutSlice, routerSlice, toasterSlice, darkModeSlice, todosSlice];

  const subscriptions = [todosFetchInitiator];

  const views = [layoutView, navView, toasterView, darkModeView, todosView];

  const app = xapp({
    root,
    slices,
    subscriptions,
    views,
  });
}
