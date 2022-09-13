import type { CruxContext } from '@crux/app';
import { selectActions, selectData } from './toaster.selectors';
import { createToasterSlice } from './toaster.slice';
import type { Alert } from './toaster.slice';

export async function createToastModule({ roots }: CruxContext) {
  const { actions, api, middleware, reducer } = createToasterSlice();

  setTimeout(() => {
    api.toast({
      id: 'sdf',
      html: '<div>test</div>',
      variant: 'primary',
      icon: 'test',
      duration: '3000'
    })
  }, 1000)

  return {
    actions,
    middleware,
    reducer,
    services: {
      api: {
        factory: () => Promise.resolve(() => api),
      },
    },
    views: {
      toast: {
        selectActions,
        selectData,
        factory: () => import('./toaster.view').then(mod => mod.createToastView),
        root: roots.toaster,
      }
    }
  };
}

