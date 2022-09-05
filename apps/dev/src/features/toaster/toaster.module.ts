import type { CruxContext } from '@crux/app';
import { createSelectActions, selectData } from './toaster.selectors';
import type { ToasterService } from './toaster.service';
import { createToasterSlice } from './toaster.slice';
import type { Alert } from './toaster.slice';

export async function createToastModule({ dispatch }: CruxContext, toaster: ToasterService) {
  const { actions, reducer } = createToasterSlice();

  setTimeout(() => {
    toaster.toast({
      id: 'sdf',
      html: '<div>test</div>',
      variant: 'primary',
      icon: 'test',
      duration: '3000'
    })
  }, 1000)

  return {
    actions,
    create,
    destroy,
    reducer,
    views: {
      toast: {
        selectActions: createSelectActions(toaster),
        selectData,
        factory: () => import('./toaster.view').then(mod => mod.createToastView),
        root: 'toast',
      }
    }
  };

  function create() {
    toaster.on('alertToasted', removeAlert);
    toaster.on('toastAdded', toastAdded);
  }

  function destroy() {
    toaster.off('alertToasted', removeAlert);
    toaster.off('toastAdded', toastAdded);
  }

  function removeAlert(alert: Alert) {
    dispatch(actions.remove(alert));
  }

  function toastAdded(alert: Alert) {
    dispatch(actions.add(alert));
  }
}

