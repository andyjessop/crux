import { createSlice } from "@crux/redux-slice";

export interface NavItem {
  active: boolean;
  route: string;
  text: string;
}

export interface NavState {
  items: NavItem[]
}

const initialState: NavState = {
  items: [{
    active: false,
    route: 'todos',
    text: 'Todos',
  },
  {
    active: false,
    route: 'projects',
    text: 'Projects',
  }],
}

export type NavStateAPI = ReturnType<typeof createNavSlice>['api']

export function createNavSlice(name: string) {
  return createSlice(name, initialState, {});
}