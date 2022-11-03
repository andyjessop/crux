import { html, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import styles from './todos.module.css';
import { cx } from '@crux/utils';
import type { TodosData } from '../domain/todos.selectors';
import { relativeTime } from '../../../utils/relative-time';
import { icon } from '../../../design/icon/icon';
import type { TodosService } from '../domain/todos.service';

// Elements
import '../components/column/column';
import '../components/container/container';
import '../components/expanding-dropzone/expanding-dropzone';
import '../components/task/task';
import '../components/task-overlay/task-overlay';

export function todosView(root: HTMLElement) {
  return function renderTodos(data: TodosData, actions: TodosService): void {
    const { draggingTaskId, tasks } = data;
    const { createTask, onDrag, onDrop, onEnter, onExit } = actions;

    const onButtonClick = (event: CustomEvent) => {
      setTimeout(() => {
        event.detail.success();
      }, 1000);
    };

    render(todos(tasks), root);

    function todos(columns: TodosData['tasks']) {
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
                <h3 class=${cx(styles['title'], styles[status])}>
                  ${icon(columnIcon)} ${title}
                  ${status === 'to-do'
                    ? html`<button @click=${createTask}>${icon('plus')}</button>`
                    : null}
                </h3>
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
