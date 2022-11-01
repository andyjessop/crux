import { generateRandomId } from '@crux/string-utils';
import { ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import type { PostTask, PutTask, Task } from '../domain/todos.types';

export function createTodosMockApi(apiBaseUrl: string) {
  let tasks = getTasks();

  return [
    rest.get(`${apiBaseUrl}/tasks`, getAllTasks),
    rest.post(`${apiBaseUrl}/tasks`, createTask),
    rest.put(`${apiBaseUrl}/tasks/:id`, updateTask),
  ];

  function getAllTasks(req: RestRequest, res: ResponseComposition, ctx: RestContext) {
    return res(ctx.status(200), ctx.json({ data: tasks }));
  }

  async function createTask(req: RestRequest, res: ResponseComposition, ctx: RestContext) {
    const body = await req.json();
    const task = body.task as PostTask;

    const newTask = {
      ...task,
      id: generateRandomId(),
      createdAt: Date.now(),
      updatedAt: null,
    } as Task;

    const firstStatusTaskIndex = tasks.findIndex((t) => t.status === task.status);

    tasks.splice(firstStatusTaskIndex, 0, newTask);

    return res(ctx.status(201), ctx.json({ data: newTask }));
  }

  async function updateTask(req: RestRequest, res: ResponseComposition, ctx: RestContext) {
    const body = await req.json();
    const task = body.task as PutTask;
    const statusNdx = body.statusNdx as number;

    const { status, text } = task;

    const newTask = {
      ...task,
      status: status ?? 'to-do',
      text: text ?? 'Do something...',
      updatedAt: Date.now(),
    } as Task;

    tasks = tasks.filter((t) => t.id !== task.id);

    // If an index for the status is provided, insert the task at that index.
    if (statusNdx !== undefined) {
      const statusTasks = [];
      const otherTasks = [];

      for (const t of tasks) {
        if (t.status === status) {
          statusTasks.push(t);

          continue;
        }

        otherTasks.push(t);
      }

      const index = statusNdx < 0 ? 0 : statusNdx;

      tasks = [...otherTasks, ...statusTasks.slice(0, index), newTask, ...statusTasks.slice(index)];
    } else {
      tasks = [...tasks, newTask];
    }

    return res(ctx.status(200), ctx.json(newTask));
  }
}

function getTasks(): Task[] {
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
