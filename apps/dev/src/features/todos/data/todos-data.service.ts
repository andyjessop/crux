import type { API } from '@crux/query';
import type { TodosHttpApi } from './todos.http';
import { toData } from './transformations';

export type TodosData = ReturnType<typeof todosData>;

export function todosData(createResource: API['createResource'], todos: TodosHttpApi) {
  const resource = createResource('todos', {
    query: async () =>
      todos
        .getAll()
        .then(toData)
        .catch((e) => {
          throw e as { message: string };
        }),
    mutations: {},
    options: {
      lazy: true,
      keepUnusedDataFor: 60,
      pollingInterval: 360,
    },
  });

  return resource.subscribe;
}
