import { getMockTodosState } from '../data/todos.mock';
import { setDraggingTaskId } from './todos.reducers';

describe('Todos Reducers', () => {
  describe('setDraggingTaskId', () => {
    it('should set the id of the task that has just been picked up', () => {
      const state = getMockTodosState();
      const draggingTaskId = '123';
      const result = setDraggingTaskId(state, draggingTaskId);

      expect(result.draggingTaskId).toBe(draggingTaskId);
    });
  });
});
