import { createSlice } from '@crux/slice';
import { merge } from '@crux/utils';

export interface Alert {
  animationDuration?: number;
  duration: number;
  html?: string;
  id: string;
  removing?: boolean;
  text?: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
}

export interface ToasterState {
  alerts: Alert[];
}

const initialState: ToasterState = {
  alerts: [],
};

export type ToasterStateAPI = ReturnType<typeof createToasterSlice>['api'];

export function createToasterSlice(name: string) {
  return createSlice(name, initialState, {
    add: (state: ToasterState, alert: Alert) => {
      const baseAlert = {
        animationDuration: 200,
      };

      return merge(state, {
        alerts: [...state.alerts, merge(baseAlert, alert)],
      });
    },

    remove: (state: ToasterState, id: string) =>
      merge(state, {
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }),

    setRemoving: (state: ToasterState, id: string) =>
      merge(state, {
        alerts: state.alerts.map((alert) =>
          alert.id !== id
            ? alert
            : {
                ...alert,
                removing: true,
              }
        ),
      }),
  });
}
