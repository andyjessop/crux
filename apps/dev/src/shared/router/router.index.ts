import { service, slice } from "@crux/xapp";

const config = {
  projects: '/projects',
  project: '/projects/:projectId',
  todos: '/todos',
};

export const routerSlice = slice(
  () => import('./router.slice').then(m => m.createRouterSlice(config)),
  {
    name: 'router',
  });

export const routerService = service(
  (slice) => import('./router.service').then(m => m.router(config, slice)),
  {
    deps: [routerSlice],
  }
);