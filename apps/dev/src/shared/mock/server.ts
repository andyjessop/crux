import { setupWorker } from 'msw';
import { createTodosMockApi } from '../../features/todos/data/todos.mock.api';

export async function createServer(apiUrl: string) {
  const handlers = [...createTodosMockApi(apiUrl)];

  return setupWorker(...handlers);
}
