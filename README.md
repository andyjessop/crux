The **V**ery **S**imple **App** (`vs-app`):

- is a web-app framework for the browser
- promotes highly-decoupled and long-lived code
- plays nicely with micro-frontends
- is really very simple

## Usage
```ts
const appEl = document.getElementById('app');

// Create the app
const app = createApp({
  // provide a state-driven layout service to handle general layout
  layout: createLayout(appEl, createTemplate),

  // modules hold all the business logic
  modules:  { root: createRootModule() },

  // views are framework-agnostic standalone components
  views: { sidebar: createSidebarView() },
});


app.dispatch('root', 'showSidebar');
```

Here, `createLayout` is a simple `lit-html` function, provided with this template:
```ts
import { html } from 'lit-html';

export function createTemplate(state: State) {
  return html`
    ${state.root.sidebar ? html`<div data-view-id="sidebar"></div>` : ''}
  `;
}
```
`layout` adapters can be made for any framework.

The `root` module (in this case) handles state changes to propagate to the layout, but modules can do other things in response to an action, such as fire events for views to consume.

Let's take a look at a view. It's a simple object containing `mount` and `unmount`, so any framework can be used here.

```ts
export function createSidebarView() {
  return {
    mount, unmount,
  };

  function mount(el: Element, state: any) {
    const span = document.createElement('span');
    
    span.innerText = 'sidebar';
    
    el.appendChild(span);
  }

  function unmount(el: Element, state: string) {
    console.log('Unmounting sidebar...');
  }
}
```
`mount` and `unmount` can also be asynchronous, if asynchronous setup work needs to be done.