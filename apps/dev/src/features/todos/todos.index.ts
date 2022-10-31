import { service, slice, view } from '@crux/xapp';
import { createSelector } from 'reselect';
import type { TodosStateAPI } from './slice/todos.slice';
import type { TodosAPI } from './domain/todos.service';
import {
  tasks,
  tasksByStatus,
  tasksCompleted,
  tasksInProgress,
  tasksTodo,
  todosData,
} from './domain/todos.selectors';
import { toasterService } from '../toaster/toaster.index';
import { dataService } from '../../shared/data/data.index';
import { envService } from '../../shared/env/env.index';

/**
 * Slice
 * =====
 */
export const todosSlice = slice(
  () => import('./slice/todos.slice').then((m) => m.createTodosSlice('todos')),
  { name: 'todos' }
);

/**
 * Service
 * =======
 */
export const todosService = service(
  (api, toaster) => import('./domain/todos.service').then((m) => m.todos(api, toaster)),
  {
    deps: [todosSlice, toasterService],
  }
);

const todosHttpApi = service(
  (env) => import('./data/todos.http').then((m) => m.createTodosHttpApi(env)),
  {
    deps: [envService],
  }
);

export const todosDataService = service(
  (data, todos) =>
    import('./data/todos-data.service').then((mod) => mod.todosData(data.createResource, todos)),
  {
    deps: [dataService, todosHttpApi],
  }
);

/**
 * Data
 * =========
 */
const selectTodos = todosSlice.selector;

const selectTasks = createSelector(selectTodos, tasks);

const selectTasksTodo = createSelector(selectTasks, tasksTodo);

const selectTasksInProgress = createSelector(selectTasks, tasksInProgress);

const selectTasksCompleted = createSelector(selectTasks, tasksCompleted);

export const selectTasksByStatus = createSelector(
  [selectTasksTodo, selectTasksInProgress, selectTasksCompleted],
  tasksByStatus
);

export type TodosData = ReturnType<typeof data>;

export const data = createSelector([selectTodos, selectTasksByStatus], todosData);

/**
 * Actions
 * =======
 */
export type TodosActions = TodosAPI & TodosStateAPI;

export const actions = service(
  (todosState, todosService) => ({
    ...todosState,
    ...todosService,
  }),
  {
    deps: [todosSlice, todosService],
  }
);

/**
 * View
 * ====
 */
export const todosView = view(() => import('./views/todos.view').then((m) => m.todosView), {
  actions,
  data,
  root: 'todos',
});
