import type { Task } from '../domain/todos.types';
import type { Response } from '../domain/todos.http';

export function toData(response: Response<Task[]>) {
  return response.data;
}
