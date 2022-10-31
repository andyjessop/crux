import { html, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { TodosActions } from '../todos.index';
import styles from './todos.module.css';
import { cx } from '@crux/utils';
import type { TodosData } from '../domain/todos.selectors';
import { relativeTime } from '../../../utils/relative-time';
import { icon } from '../../../design/icon/icon';

// Elements
import '../components/column/column';
import '../components/container/container';
import '../components/expanding-dropzone/expanding-dropzone';
import '../components/task/task';
import '../components/task-overlay/task-overlay';

export function todosView(root: HTMLElement) {
  return function renderTodos(data: TodosData, actions: TodosActions): void {
    const { draggingTaskId, tasks } = data;
    const { onDrag, onDrop, onEnter, onExit } = actions;

    render(todos(tasks), root);

    function todos(tasks: TodosData['tasks']) {
      const { toDo, inProgress, completed } = tasks;

      const columns = [
        { icon: 'bell', status: 'to-do', tasks: toDo, title: 'To Do' },
        {
          icon: 'shipping-fast',
          status: 'in-progress',
          tasks: inProgress,
          title: 'In Progress',
        },
        { icon: 'check-circle', status: 'completed', tasks: completed, title: 'Completed' },
      ];

      return html`
        <todos-container
          @dragTask=${handleDrag}
          @dropTask=${handleDrop}
          dragging-class="dragging"
          id-attribute="id"
          drag-selector="todo-task"
        >
          ${repeat(
            columns,
            (column) => column.status,
            ({ icon: columnIcon, status, tasks, title }) => html`
              <todos-column status=${status}>
                <h3 class=${cx(styles['title'], styles[status])}>${icon(columnIcon)}${title}</h3>
                ${repeat(
                  tasks,
                  (task) => task.id,
                  ({ createdAt, id, status, text }, ndx) =>
                    html`
                      <todo-task
                        created-at=${relativeTime(createdAt)}
                        dragging-task-id=${draggingTaskId}
                        id=${id}
                        status=${status}
                        task-id=${id}
                        text=${text}
                      >
                        ${draggingTaskId && draggingTaskId !== id
                          ? html`
                              <task-overlay
                                index=${ndx}
                                @overlay-enter=${handleEnter}
                                @overlay-exit=${handleExit}
                                placement="before"
                                status=${status}
                              ></task-overlay>
                              <task-overlay
                                index=${ndx}
                                @overlay-enter=${handleEnter}
                                @overlay-exit=${handleExit}
                                placement="after"
                                status=${status}
                              ></task-overlay>
                            `
                          : null}
                      </todo-task>
                    `
                )}
                ${draggingTaskId
                  ? html`<expanding-dropzone
                      @status-overlay-enter=${handleStatusEnter}
                      @status-overlay-exit=${handleExit}
                      status=${status}
                    ></expanding-dropzone>`
                  : null}
              </todos-column>
            `
          )}
        </todos-container>
      `;

      function handleDrag(event: CustomEvent) {
        onDrag(event.detail.id);
      }

      function handleDrop(event: CustomEvent) {
        onDrop(event.detail.id);
      }

      function handleEnter(event: CustomEvent) {
        onEnter(event.detail.index, event.detail.status);
      }

      function handleExit() {
        onExit();
      }

      function handleStatusEnter(event: CustomEvent) {
        const numTasks = columns.find((column) => column.status === event.detail.status)?.tasks
          .length;

        if (numTasks === undefined) {
          return;
        }

        onEnter(numTasks, event.detail.status);
      }
    }
  };
}
