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

export function createToasterSlice(name: string) {
  return createSlice<ToasterSlice>()(name, initialState, {
    add: (state, payload) => merge(state, {
      alerts: [...state.alerts, payload],
    }),

    remove: (state, payload) => merge(state, {
      alerts: state.alerts.filter(alert => alert.id !== payload.id),
    }),
    
    toast: (state, payload) => async ({ api }) => {
      await api.add(payload);

      document.querySelector<SlAlert>(`#${payload.id}`)?.toast();

      await api.remove(payload);
    }
  });
}