import { setupWorker } from 'msw';
import { createTodosMocks } from '../../features/todos/data/mock.handlers';

export async function createServer(apiUrl: string) {
  const handlers = [...createTodosMocks(apiUrl)];

  return setupWorker(...handlers);
}
