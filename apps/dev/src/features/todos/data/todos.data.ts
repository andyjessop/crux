import type { API } from '@crux/query';
import type { PostTask, PutTask } from '../domain/todos.types';
import type { TodosHttpApi } from '../domain/todos.http';
import { toData } from './transformations';

export type TodosData = ReturnType<typeof todosData>;

export function todosData(createResource: API['createResource'], todos: TodosHttpApi) {
  const resource = createResource('todos', {
    query: async () => todos.getAll().then(toData),
    mutations: {
      createTask: {
        query: async (task: PostTask) => todos.createTask(task),
      },
      updateTask: {
        query: async (task: PutTask, statusNdx?: number) => todos.updateTask(task, statusNdx),
      },
    },
    options: {
      lazy: true,
      keepUnusedDataFor: 60,
      pollingInterval: 60,
    },
  });

  return resource.subscribe();
}
