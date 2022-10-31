export function createDraggable({
  idAttribute,
  draggingClass,
  dragSelector,
  onDrag,
  onDragMove,
  onDrop,
}: {
  idAttribute: string;
  draggingClass?: string;
  dragSelector: string;
  onDrag: (id: string, event: Event) => void;
  onDragMove?: (event: Event) => void;
  onDrop: (id: string, event: Event) => void;
}) {
  document.addEventListener('pointerdown', onPointerdown);

  return () => {
    document.removeEventListener('pointerdown', onPointerdown);
  };

  function onPointerdown(event: Event) {
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
    clone.style.position = 'absolute';
    clone.style.zIndex = '1000';
    clone.style.userSelect = 'none';
    clone.style.pointerEvents = 'none';

    if (draggingClass) {
      clone.className = draggingClass;
    }

    clone.ondragstart = function () {
      return false;
    };

    document.body.append(clone);

    document.addEventListener('pointermove', onPointermove);
    document.addEventListener('pointerup', onPointerup);

    snapTo(x, y);
    onDrag(target.getAttribute(idAttribute), event);

    function snapTo(clientX: number, clientY: number) {
      clone.style.left = clientX - shiftX + 'px';
      clone.style.top = clientY - shiftY + 'px';
    }

    function onPointermove(event: Event) {
      const currentX = (event as PointerEvent).clientX;
      const currentY = (event as PointerEvent).clientY;

      snapTo(currentX, currentY);

      onDragMove?.(event);
    }

    function onPointerup() {
      document.removeEventListener('pointermove', onPointermove);
      document.removeEventListener('pointerup', onPointerup);
      clone.remove();
      onDrop(target.getAttribute(idAttribute), event);
    }
  }
}
