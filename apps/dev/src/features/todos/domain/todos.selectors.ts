import type { Task, TodosState } from './todos.types';

/**
 * Select all the tasks.
 */
export function tasks(todos: TodosState): Task[] {
  return todos.tasks;
}

/**
 * Select the to-do tasks.
 */
export function tasksTodo(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === 'to-do');
}

/**
 * Select the in-progress tasks.
 */
export function tasksInProgress(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === 'in-progress');
}

/**
 * Select the completed tasks.
 */
export function tasksCompleted(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === 'completed');
}

/**
 * Select the tasks as an object with status keys.
 */
export function tasksByStatus(toDo: Task[], inProgress: Task[], completed: Task[]) {
  return {
    toDo,
    inProgress,
    completed,
  };
}

/**
 * Select all data required for the todo view.
 */
export function todosData(todos: TodosState, tasks: ReturnType<typeof tasksByStatus>) {
  return {
    draggingTaskId: todos.draggingTaskId,
    tasks,
  };
}

export type TodosData = ReturnType<typeof todosData>;
