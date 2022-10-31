import type { Task } from '../domain/todos.types';
import type { Response } from './todos.http';

export function toData(response: Response<Task[]>) {
  return response.data;
}
