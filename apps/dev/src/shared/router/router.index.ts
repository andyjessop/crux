import { service, slice } from '@crux/crux';

const config = {
  todos: '/todos',
};

export const routerSlice = slice(
  () => import('./router.slice').then((m) => m.createRouterSlice(config)),
  {
    name: 'router',
  }
);

export const routerService = service(
  (slice) => import('./router.service').then((m) => m.router(config, slice)),
  {
    deps: [routerSlice],
  }
);
