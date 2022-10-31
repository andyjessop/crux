import { ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import type { Task } from '../domain/todos.types';

export function createTodosMocks(apiBaseUrl: string) {
  return [
    /**
     * Projects.
     */
    rest.get(`${apiBaseUrl}/tasks`, getTasks),
  ];
}

function getTasks(req: RestRequest, res: ResponseComposition, ctx: RestContext) {
  return res(ctx.status(200), ctx.json(tasks()));
}

function tasks(): Task[] {
  return [
    {
      createdAt: Date.now() - 1000 * 60,
      id: '1',
      status: 'to-do',
      text: 'Pick up shopping',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 2,
      id: '2',
      status: 'to-do',
      text: 'Bath kids',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 3,
      id: '3',
      status: 'to-do',
      text: 'Learn Web Components',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 4,
      id: '4',
      status: 'to-do',
      text: 'Write JS Framework',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60,
      id: '5',
      status: 'to-do',
      text: 'Sign-up for next Moon mission',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      id: '6',
      status: 'in-progress',
      text: 'Try all the mushrooms in the garden',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      id: '7',
      status: 'in-progress',
      text: 'Make sure the shed is shut when you let the dogs out',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
      id: '8',
      status: 'in-progress',
      text: 'Let the dogs out',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      id: '9',
      status: 'in-progress',
      text: 'Read Clean Code by Robert C. Martin',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      id: '10',
      status: 'in-progress',
      text: 'Learn how to read',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      id: '11',
      status: 'in-progress',
      text: 'Learn lit-element',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      id: '12',
      status: 'completed',
      text: "Try to let the little things wash over you. Honestly, it's just not worth it.",
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      id: '13',
      status: 'completed',
      text: 'Go on and on about Web Components and web standards until people start to listen or get bored.',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
      id: '14',
      status: 'completed',
      text: 'Make dinner',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      id: '15',
      status: 'completed',
      text: 'Pick up kids from school',
      updatedAt: null,
    },
    {
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
      id: '16',
      status: 'completed',
      text: 'Ask for a raise',
      updatedAt: null,
    },
  ];
}
