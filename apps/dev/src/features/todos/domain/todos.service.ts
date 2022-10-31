import type { ToasterAPI } from '../../toaster/toaster.service';
import type { TodosStateAPI } from '../slice/todos.slice';
import type { Status } from './todos.types';

export type TodosAPI = ReturnType<typeof todos>;

export function todos(state: TodosStateAPI, toaster: ToasterAPI) {
  return {
    onDrag,
    onDrop,
    onEnter,
    onExit,
  };

  function onDrag(taskId: string) {
    state.setDraggingTaskId(taskId);
  }

  async function onDrop(taskId: string) {
    state.setDraggingTaskId(null);

    const { hoveringState, tasks } = state.getState();

    if (!hoveringState) {
      return;
    }

    const { ndx: hoveringIndex, status: hoveringStatus } = hoveringState;

    if (hoveringIndex !== undefined && hoveringStatus !== undefined) {
      const newStatusTasks = tasks.filter((task) => task.status === hoveringStatus);
      const ndx = newStatusTasks.findIndex((task) => task.id === taskId);
      const task = tasks.find((task) => task.id === taskId);

      // If it's the same status and the new index is -0.5 <= ndx <= 0.5, then do nothing.
      if (hoveringStatus === task.status && Math.abs(ndx - hoveringIndex) < 1) {
        return;
      }

      state.removeTask(taskId);

      const newStatusIndex =
        hoveringIndex < 1 ? Math.floor(hoveringIndex) : Math.ceil(hoveringIndex);

      const moved = state.addTask({ ...task, status: hoveringStatus }, newStatusIndex);

      // Check if the task was actually moved
      if (moved) {
        toaster.toast({
          duration: 4000,
          text: `Task moved to ${hoveringStatus}.`,
          variant: 'success',
        });
      }
    }
  }

  function onEnter(taskNdx: number, status: Status) {
    state.setHoveringState({ ndx: taskNdx, status });
  }

  function onExit() {
    state.setHoveringState(null);
  }
}
