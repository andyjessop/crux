import { createEventEmitter } from "@crux/event-emitter";
import type { SlAlert } from "@shoelace-style/shoelace";
import type ShoelaceElement from "@shoelace-style/shoelace/dist/internal/shoelace-element";
import type { Alert } from "./toaster.slice";

export type ToasterService = ReturnType<typeof createToasterSevice>;

type Events = {
  alertToasted: Alert,
  toastAdded: Alert,
};

export function createToasterSevice() {
  const emitter = createEventEmitter<Events>();

  return {
    ...emitter,
    toast,
    toastAlert,
  };

  function toastAlert(alert: Alert) {
    document.querySelector<SlAlert>(`#${alert.id}`)?.toast();

    emitter.emit('alertToasted', alert);
  }

  async function toast(alert: Alert) {
    emitter.emit('toastAdded', alert);
  }
}