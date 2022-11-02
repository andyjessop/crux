import type { Env } from '../../../shared/env/env.service';
import { Variable } from '../../../shared/env/env.service';
import type { PostTask, PutTask, Task } from '../domain/todos.types';

export interface Response<Data> {
  data: Data;
}

export type TodosHttpApi = ReturnType<typeof createTodosHttpApi>;

export function createTodosHttpApi(env: Env) {
  return {
    /**
     * Create a task.
     */
    createTask: (task: PostTask): Promise<Response<Task>> =>
      fetch(`${env.get(Variable.VITE_API_URL)}/tasks`, {
        body: JSON.stringify({ task }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then((res) => res.json()),

    /**
     * Fetch all tasks as an array.
     */
    getAll: (): Promise<Response<Task[]>> =>
      fetch(`${env.get(Variable.VITE_API_URL)}/tasks`).then((res) => res.json()),

    /**
     * Update a task.
     */
    updateTask: (task: PutTask, statusNdx?: number): Promise<Response<Task>> =>
      fetch(`${env.get(Variable.VITE_API_URL)}/tasks/${task.id}`, {
        body: JSON.stringify({ task, statusNdx }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      }).then((res) => res.json()),
  };
}
