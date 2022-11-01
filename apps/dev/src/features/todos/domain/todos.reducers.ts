import { merge } from '@crux/utils';
import type { TodosState } from './todos.types';

/**
 * Set the id of the task that has just been picked up.
 */
export function setDraggingTaskId(state: TodosState, draggingTaskId: string) {
  return merge(state, { draggingTaskId });
}

/**
 * Sets the index and status where the dragging task is hovering. Note that the index is always +/- 0.5 of a task's index.
 */
export function setHoveringState(state: TodosState, hoveringState: TodosState['hoveringState']) {
  return merge(state, { hoveringState });
}
