import { createSlice } from "@crux/redux-slice";
import type { ApiOf } from '@crux/redux-slice';
import { merge } from "@crux/utils";
import type { SlAlert } from "@shoelace-style/shoelace";

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

type ToasterSlice = {
  add: Alert,
  remove: Alert,
  toast: Alert,
};

export type ToasterAPI = ApiOf<ToasterSlice>;

export function createToasterSlice() {
  return createSlice<ToasterSlice>()('toast', initialState, {
    add: (state: ToasterState, payload: Alert) => merge(state, {
      alerts: [...state.alerts, payload],
    }),
    remove: (state: ToasterState, payload: Alert) => merge(state, {
      alerts: state.alerts.filter(alert => alert.id !== payload.id),
    }),
    toast: (state: ToasterState, payload: Alert) => async ({ api }) => {
      await api.add(payload);

      document.querySelector<SlAlert>(`#${payload.id}`)?.toast();

      await api.remove(payload);
    }
  });
}