import { service, slice, subscription, view } from '@crux/crux';
import { createSelector } from 'reselect';
import {
  taskColumns,
  tasksCompleted,
  tasksInProgress,
  tasksTodo,
  todosData,
} from './domain/todos.selectors';
import { toasterService } from '../toaster/toaster.index';
import { dataService } from '../../shared/data/data.index';
import { envService } from '../../shared/env/env.index';
import type { Task } from './domain/todos.types';
import type { ExtractInstance } from 'packages/crux/src/lib/types';
import { routerSlice } from '../../shared/router/router.index';

const selectTodosRoute = createSelector(
  [routerSlice.selector],
  (router) => router?.route?.name === 'todos'
);

/**
 * Slice
 * =====
 */
export const todosSlice = slice(
  () => import('./slice/todos.slice').then((m) => m.createTodosSlice('todos')),
  {
    name: 'todos',
    shouldBeEnabled: selectTodosRoute,
  }
);

/**
 * Services
 * =======
 */
const todosHttpApi = service(
  (env) => import('./domain/todos.http').then((m) => m.createTodosHttpApi(env)),
  {
    deps: [envService],
  }
);

export const todosDataService = service(
  (data, todos) =>
    import('./data/todos.data').then((mod) => mod.todosData(data.createResource, todos)),
  {
    deps: [dataService, todosHttpApi],
  }
);

export type TodosRepository = ExtractInstance<typeof todosRepository>;

export const todosRepository = service(
  (data, slice) => ({
    createTask: data.createTask,
    getHoveringState: () => slice.getState().hoveringState,
    getTasks: () => data.getState().data,
    setDraggingTaskId: slice.setDraggingTaskId,
    setHoveringState: slice.setHoveringState,
    updateTask: data.updateTask,
  }),
  { deps: [todosDataService, todosSlice] }
);

export const todosService = service(
  (repository, toaster) =>
    import('./domain/todos.service').then((m) => m.todosService(repository, toaster)),
  {
    deps: [todosRepository, toasterService],
  }
);

/**
 * Subscriptions
 * =============
 */
export const todosFetchInitiator = subscription(
  (data) => import('./data/todos.subscription').then((m) => m.initiateFetch(data)),
  {
    deps: [todosDataService],
    shouldBeEnabled: selectTodosRoute,
  }
);

/**
 * Data
 * ====
 */
const selectTodos = todosSlice.selector;

// TODO: add selector(factory, { deps }) to allow passing slices and services as deps
//       instead of having to define the state structure here.
const selectTasks = (state: { [key: string]: { todos: any } }) =>
  state.data?.todos?.data ?? ([] as Task[]);

const selectTasksTodo = createSelector(selectTasks, tasksTodo);

const selectTasksInProgress = createSelector(selectTasks, tasksInProgress);

const selectTasksCompleted = createSelector(selectTasks, tasksCompleted);

export const selectTasksByStatus = createSelector(
  [selectTasksTodo, selectTasksInProgress, selectTasksCompleted],
  taskColumns
);

export type TodosData = ReturnType<typeof data>;

const data = createSelector([selectTodos, selectTasksByStatus], todosData);

/**
 * View
 * ====
 */
export const todosView = view(() => import('./views/todos.view').then((m) => m.todosView), {
  actions: todosService,
  data,
  root: 'todos',
});
