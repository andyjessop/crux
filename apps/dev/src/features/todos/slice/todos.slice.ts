import { createSlice } from '@crux/redux-slice';
import {
  addTask,
  clearCompletedTasks,
  removeTask,
  setDraggingTaskId,
  setHoveringState,
  setRemoving,
} from '../domain/todos.reducers';
import { getMockTodosState } from '../data/todos.mock';

// const initialState: TodosState = {
//   tasks: [],
// };

export type TodosStateAPI = ReturnType<typeof createTodosSlice>['api'];

export function createTodosSlice(name: string) {
  return createSlice(name, getMockTodosState(), {
    addTask,
    clearCompletedTasks,
    removeTask,
    setDraggingTaskId,
    setHoveringState,
    setRemoving,
  });
}
