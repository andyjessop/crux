import type { ToasterAPI } from '../../toaster/toaster.service';
import type { TodosRepository } from '../todos.index';
import type { Status } from './todos.types';

export type TodosService = ReturnType<typeof todosService>;

export function todosService(repository: TodosRepository, toaster: ToasterAPI) {
  return {
    createTask,
    onDrag,
    onDrop,
    onEnter,
    onExit,
  };

  function createTask() {
    repository.createTask({
      status: 'to-do',
      text: 'Do something...',
    });
  }

  function onDrag(taskId: string) {
    repository.setDraggingTaskId(taskId);
  }

  async function onDrop(taskId: string) {
    repository.setDraggingTaskId(null);

    const tasks = repository.getTasks();
    const hoveringState = repository.getHoveringState();

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

      // state.removeTask(taskId);

      const newStatusIndex =
        hoveringIndex < 1 ? Math.floor(hoveringIndex) : Math.ceil(hoveringIndex);

      try {
        await repository.updateTask({ ...task, status: hoveringStatus }, newStatusIndex);

        toaster.toast({
          duration: 4000,
          text: `Task moved to ${hoveringStatus}.`,
          variant: 'success',
        });
      } catch (e) {
        toaster.toast({
          duration: 4000,
          text: `Failed to move task to ${hoveringStatus}.`,
          variant: 'danger',
        });
      }

      // const moved = state.addTask({ ...task, status: hoveringStatus }, newStatusIndex);
    }
  }

  function onEnter(taskNdx: number, status: Status) {
    repository.setHoveringState({ ndx: taskNdx, status });
  }

  function onExit() {
    repository.setHoveringState(null);
  }
}
