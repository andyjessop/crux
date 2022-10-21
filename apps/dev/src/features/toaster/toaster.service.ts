import { generateRandomId } from "@crux/string-utils";
import { sleep } from "@crux/utils";
import type { Alert, ToasterStateAPI } from "./toaster.slice";

export type BaseAlert = Omit<Alert, 'id'>;

export type ToasterAPI = ReturnType<typeof toaster>;

export function toaster(api: ToasterStateAPI) {
  return {
    close,
    toast,
  };

  async function close(id: string) {
    const { alerts } = api.getState();

    const alert = alerts.find((a) => a.id === id);

    api.setRemoving(id);

    await sleep(alert.animationDuration);

    api.remove(id);
  }

  async function toast(alert: BaseAlert) {
    const id = generateRandomId();
    const alertWithId = { ...alert, id };

    api.add(alertWithId);

    if (alert.duration !== undefined) {
      await sleep(alert.duration)
      
      api.setRemoving(id);
        
      await sleep(alert.animationDuration ?? 0);

      api.remove(id);
    }

    return id;
  }
}