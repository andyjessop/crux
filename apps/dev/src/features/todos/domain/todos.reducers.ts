import { generateRandomId } from '@crux/string-utils';
import { merge } from '@crux/utils';
import type { Task, TodosState } from './todos.types';

/**
 * Add a new task to the list as a 'to-do' item.
 */
export function addTask(state: TodosState, task: Partial<Task>, statusNdx?: number) {
  const { createdAt, id, status, text } = task;

  const newTask = {
    createdAt: createdAt ?? Date.now(),
    id: id ?? generateRandomId(),
    status: status ?? 'to-do',
    text: text ?? 'Do something...',
    updatedAt: createdAt ? Date.now() : null,
  };

  // If an index for the stateus is provided, insert the task at that index.
  if (statusNdx !== undefined) {
    const statusTasks = [];
    const otherTasks = [];

    for (const t of state.tasks) {
      if (t.status === status) {
        statusTasks.push(t);

        continue;
      }

      otherTasks.push(t);
    }

    const index = statusNdx < 0 ? 0 : statusNdx;

    const tasks = [
      ...otherTasks,
      ...statusTasks.slice(0, index),
      newTask,
      ...statusTasks.slice(index),
    ];

    return merge(state, { tasks });
  }

  return merge(state, {
    tasks: [...state.tasks, newTask],
  });
}

/**
 * Clear all completed tasks.
 */
export function clearCompletedTasks(state: TodosState) {
  return merge(state, { tasks: state.tasks.filter((task) => task.status !== 'completed') });
}

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

/**
 * Set the `removing` flag of a task. This allows you to do some removal animation.
 */
export function setRemoving(state: TodosState, taskId: string, isRemoving = true) {
  return merge(state, {
    tasks: state.tasks.map((task) =>
      task.id === taskId ? merge(task, { removing: isRemoving }) : task
    ),
  });
}

/**
 * Remove a task from the list.
 */
export function removeTask(state: TodosState, id: string) {
  return merge(state, { tasks: state.tasks.filter((task) => task.id !== id) });
}
