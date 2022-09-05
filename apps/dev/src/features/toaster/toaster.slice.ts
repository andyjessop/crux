import { slice } from "@crux/redux-slice";
import { merge } from "@crux/utils";

export interface Alert {
  duration: string;
  html: string;
  icon: string;
  id: string;
  variant: string;
}

export interface ToasterState {
  alerts: Alert[]
}

const initialState: ToasterState = {
  alerts: [],
}

export function createToasterSlice() {
  return slice({
    add: (state: ToasterState, payload: Alert) => merge(state, {
      alerts: [...state.alerts, payload],
    }),
    remove: (state: ToasterState, payload: Alert) => merge(state, {
      alerts: state.alerts.filter(alert => alert.id !== payload.id),
    }),
  }, { initialState, name: 'toast' });
}