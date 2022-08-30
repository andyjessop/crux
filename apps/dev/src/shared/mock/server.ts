import { setupWorker } from 'msw';
import { createMocks } from '../../features/auth/api/mock/handlers';

export async function createServer(apiBaseUrl: string) {
  const mocks = await createMocks('crux', apiBaseUrl);

  const handlers = [
    ...mocks
  ];

  return setupWorker(...handlers);
} 
