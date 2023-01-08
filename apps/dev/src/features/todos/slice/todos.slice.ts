import { createSlice } from '@crux/slice';
import { setDraggingTaskId, setHoveringState } from '../domain/todos.reducers';
import type { TodosState } from '../domain/todos.types';

const initialState = {
  hoveringState: undefined,
  draggingTaskId: undefined,
} as TodosState;

export type TodosStateAPI = ReturnType<typeof createTodosSlice>['api'];

export function createTodosSlice(name: string) {
  return createSlice(name, initialState, {
    setDraggingTaskId,
    setHoveringState,
  });
}
