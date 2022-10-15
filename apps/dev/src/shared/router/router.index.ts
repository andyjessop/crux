import { slice } from "@crux/xapp";

export const routerSlice = slice(() => import('./router.slice').then(m => m.createRouterSlice({
  projects: '/projects',
  project: '/projects/:projectId',
})));
