import { render, TemplateResult } from 'lit-html';

export function createLayout(root: HTMLElement, template: Template) {
  const mounted: Mounted = {};

  return {
    update,
  };

  function update(state: any) {
    render(template(state), root);

    const views = Array.from(document.querySelectorAll('[data-view-id]'));

    let mount: { el: Element, viewId: string }[] = [];

    const mountedCopy = { ...mounted };

    views.forEach(view => {
      const viewId = view.getAttribute('data-view-id');

      if (!viewId) {
        throw Error('viewId not found');
      }

      if (!mounted[viewId]) {
        mounted[viewId] = view;
        mount.push({ el: view, viewId });
      } else {
        delete mountedCopy[viewId];
      }
    });

    // Any remaining views in mountedCopy are to be unmounted
    const unmount = Object.entries(mountedCopy)
      .map(([viewId, el]) => ({ el, viewId }));

    return {
      mount, unmount,
    };
  }
}

type Mounted = Record<string, Element>;
type Template = (state: any) => TemplateResult;