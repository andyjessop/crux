import { Env, Variable } from 'apps/dev/src/shared/env/env.service';
import type { Task } from '../domain/todos.types';

export interface Response<Data> {
  data: Data;
}

export type TodosHttpApi = ReturnType<typeof createTodosHttpApi>;

export function createTodosHttpApi(env: Env) {
  return {
    getAll: (): Promise<Response<Task[]>> =>
      fetch(`${env.get(Variable.VITE_API_URL)}/tasks`).then((res) => res.json()),
  };
}
