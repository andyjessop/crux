import { Directive, directive } from 'lit/directive.js';
import type { ElementPart } from 'lit/directive.js';
import { noChange } from 'lit';
export class Draggable extends Directive {
  registered = false;

  render({
    dataProp,
    draggingClass,
    dragSelector,
    onDrag,
    onDragMove,
    onDrop,
  }: {
    dataProp: string;
    draggingClass?: string;
    dragSelector: string;
    onDrag: (id: string, event: Event) => void;
    onDragMove?: (event: Event) => void;
    onDrop: (id: string, event: Event) => void;
  }) {
    return noChange;
  }

  update(
    part: ElementPart,
    [{ dataProp, draggingClass, dragSelector, onDrag, onDragMove, onDrop }]: Parameters<
      Draggable['render']
    >
  ) {
    if (this.registered) {
      return;
    }

    this.registered = true;

    const { element } = part;

    element.addEventListener('pointerdown', (event) => {
      const target = (event.target as HTMLElement)?.closest(dragSelector) as HTMLElement;

      if (!target) {
        return;
      }

      const x = (event as PointerEvent).clientX;
      const y = (event as PointerEvent).clientY;

      const rect = target.getBoundingClientRect();
      let shiftX = x - rect.left;
      let shiftY = y - rect.top;

      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      // clone.style.position = 'absolute';
      // clone.style.zIndex = '1000';
      // clone.style.transition = 'none';
      // clone.style.pointerEvents = 'none';

      if (draggingClass) {
        clone.className = draggingClass;
      }

      clone.ondragstart = function () {
        return false;
      };

      document.body.append(clone);

      snapTo(x, y);

      document.addEventListener('pointermove', onMouseMove);

      document.addEventListener('pointerup', () => {
        document.removeEventListener('pointermove', onMouseMove);
        clone.remove();
        onDrop(target.dataset[dataProp], event);
      });

      onDrag(target.dataset[dataProp], event);

      function snapTo(clientX: number, clientY: number) {
        clone.style.left = clientX - shiftX + 'px';
        clone.style.top = clientY - shiftY + 'px';
      }

      function onMouseMove(event: Event) {
        const currentX = (event as PointerEvent).clientX;
        const currentY = (event as PointerEvent).clientY;

        snapTo(currentX, currentY);

        onDragMove?.(event);
      }
    });

    return noChange;
  }
}

export const draggable = directive(Draggable);
