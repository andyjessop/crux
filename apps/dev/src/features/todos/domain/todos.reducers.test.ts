import { getMockTodosState } from '../data/todos.mock';
import { addTask, clearCompletedTasks, setDraggingTaskId } from './todos.reducers';
import { Status } from './todos.types';

const baseState = {
  hoveringState: null,
};

describe('Todos Reducers', () => {
  describe('addTask', () => {
    it('should add a new task to the list as a "to-do" item', () => {
      const state = getMockTodosState();
      const text = 'New Task';
      const result = addTask(state, { text });

      expect(result.tasks.length).toBe(state.tasks.length + 1);
      expect(result.tasks[result.tasks.length - 1].text).toBe(text);
      expect(result.tasks[result.tasks.length - 1].status).toBe('to-do');
    });

    it('should add a new task to the list as a "to-do" item', () => {
      const text = 'New Task';
      const result = addTask({ ...baseState, tasks: [] }, { text });

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].text).toBe(text);
      expect(result.tasks[0].status).toBe('to-do');
    });

    it('should add a new task at index at the start of the list (1)', () => {
      const state = getMockTodosState();
      const task = { ...state.tasks[1] }; // id: '2'
      const result = addTask(state, task, -1);

      const tasks = result.tasks.filter((task) => task.status === 'to-do');

      expect(tasks[0].id).toBe('2');
    });

    it('should add a new task at index at the start of the list (2)', () => {
      const state = getMockTodosState();
      const task = { ...state.tasks[1] }; // id: '2'
      const result = addTask(state, task, 0);

      const tasks = result.tasks.filter((task) => task.status === 'to-do');

      expect(tasks[0].id).toBe('2');
    });

    it('should add a new task at in the middle of the list', () => {
      const state = getMockTodosState();
      const task = { ...state.tasks[1] }; // id: '2'
      const result = addTask(state, task, 1);

      const tasks = result.tasks.filter((task) => task.status === 'to-do');

      expect(tasks[1].id).toBe('2');
    });

    it('should add a new task to the end of the list', () => {
      const state = getMockTodosState();
      const task = { ...state.tasks[1] }; // id: '2'

      debugger;
      const result = addTask(state, task, 5);

      const tasks = result.tasks.filter((task) => task.status === 'to-do');

      expect(tasks[5].id).toBe('2');
    });

    it('should add a new task to the end of the a different list', () => {
      const state = getMockTodosState();
      const task = { ...state.tasks[1], status: 'completed' as Status }; // id: '2'
      const result = addTask(state, task, 5);

      const tasks = result.tasks.filter((task) => task.status === 'completed');

      expect(tasks[5].id).toBe('2');
    });
  });

  describe('clearCompletedTasks', () => {
    it('should clear all completed tasks', () => {
      const state = getMockTodosState();
      const result = clearCompletedTasks(state);

      expect(result.tasks.length).toBe(state.tasks.length - 5);
      expect(result.tasks.filter((task) => task.status === 'completed').length).toBe(0);
    });

    it('should clear all completed tasks', () => {
      const result = clearCompletedTasks({ ...baseState, tasks: [] });

      expect(result.tasks.length).toBe(0);
    });
  });

  describe('setDraggingTaskId', () => {
    it('should set the id of the task that has just been picked up', () => {
      const state = getMockTodosState();
      const draggingTaskId = '123';
      const result = setDraggingTaskId(state, draggingTaskId);

      expect(result.draggingTaskId).toBe(draggingTaskId);
    });
  });
});
