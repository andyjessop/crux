import type { TodosService } from './todos.service';
import type { Task, TodosState } from './todos.types';

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
export function taskColumns(toDo: Task[], inProgress: Task[], completed: Task[]) {
  return [
    { icon: 'bell', status: 'to-do', tasks: toDo, title: 'To Do' },
    {
      icon: 'shipping-fast',
      status: 'in-progress',
      tasks: inProgress,
      title: 'In Progress',
    },
    { icon: 'check-circle', status: 'completed', tasks: completed, title: 'Completed' },
  ];
}

/**
 * Select all data required for the todo view.
 */
export function todosData(todos: TodosState, tasks: ReturnType<typeof taskColumns>) {
  return {
    draggingTaskId: todos.draggingTaskId,
    tasks,
  };
}

export type TodosData = ReturnType<typeof todosData>;

export function todosActions(api: TodosService) {
  return api;
}

export type TodosActions = ReturnType<typeof todosActions>;
