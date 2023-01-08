import { createSlice } from '@crux/slice';

export interface Template {}

export interface TemplateState {
  data: Template[];
}

const initialState: TemplateState = {
  data: [],
};

export type TemplateStateAPI = ReturnType<typeof createTemplateSlice>['api'];

export function createTemplateSlice(name: string) {
  return createSlice(name, initialState, {});
}
