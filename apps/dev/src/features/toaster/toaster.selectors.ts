import type { ToasterService } from "./toaster.service";
import type { createToasterSlice, ToasterState } from "./toaster.slice";

export type ToasterActions = ReturnType<typeof createToasterSlice>['actions'] & Pick<ToasterService, 'toastAlert'>;

export function createSelectActions(service: ToasterService) {
  return function selectActions(actions: { toast: ToasterActions }) {
    return {
      ...actions.toast,
      toastAlert: service.toastAlert,
    };
  }
}
export function selectActions(actions: { toast: ToasterActions }) {
  return actions.toast;
}

export function selectData(state: { toast: ToasterState }) {
  return state.toast;
}