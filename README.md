# `ll-cool-app`

`ll-cool-app` is the framework for long-lived code.

The core concept is that you shouldn't be locked-into a single framework that determines the structure of your code and makes it difficult to change. Instead, the majority of your code should be framework-agnostic, and should be able to simply plug-in to a minimal core. `ll-cool-app` is that core.

`ll-cool-app` supports "micro-frontends", enabling large codebases to be split into smaller, more manageable, components. Small teams can work independently, allowing them to add code and deploy independently, focussing only on the parts of the site that are relevant to them.

`ll-cool-app` enables you to transition to a separate framework without doing a complete re-write of the code. Apps written in a single framework, and built around that framework, are essentially technical debt because the amount of work required to move off that framework at some point grows with every line of code added. `ll-cool-app` encourages you to write code that doesn't rely on a framework and so can be more easily transitioned to a different framework as your business requirements dictate.

In summary, `ll-cool-app`:

- is a web-app framework for the browser
- promotes highly-decoupled and long-lived code
- provides simple integration of micro-frontends
- lowers your level of technical debt.

## Usage

```ts
import { createApp } from 'll-cool-app';
import { layout } from 'my-app/layout';
import { post, posts } from 'my-app/views';
import { posts, user } from 'my-app/modules';

const app = createApp({
  // App root element
  el: document.getElementById('app'),

  /*
  * The job of the layout is to control the top-level HTML of the app.
  * It is a function that returns an object with an `update` method,
  * called on every "dispatch".
  *
  * The layout defines view roots, to which the app attaches and
  * instantiates views as necessary.
  *
  * The layout can use any view framework.
  */
  layout,

  /**
   * Modules hold all the business logic of the app. They can define
   * events that are called by "dispatch" and can emit events of their
   * own for views to consume.
   **/
  modules:  {
    posts,
    user,
  },

  /**
   * A small and lightweight router is available  
   **/
  routes: {
    post: '/posts/:id',
    posts: '/posts'
  },

  /*
   * Views can be written independently in any framework, and are instantiated
   * individually on an element root provided by the layout. They can subscribe
   * to events emanating from the modules
   **/
  views: {
    post,
    posts,
  },
});
```

`layout` is a simple function that returns an object with an `update` method. When `update` is called, the template updates and renders the layout into the DOM.

It is the job of the layout to provide root elements for the views, and it does this by attaching `data-view-id` attributes to those roots. In this way, it is completely decoupled from the views, and can therefore be written in a separate framework or none at all.

This example of the `layout` uses `lit-html`:

```ts
import { html, render } from 'lit-html';

export function layout({
  el, modules, router,
}) {
  return {
    update,
  };

  function template(route: Router.RouteData | null) {
    switch (route?.name) {
      case 'post':
        return html`<div data-view-id="post"></div>`;
      case 'posts':
        return html`<div data-view-id="posts"></div>`;
      default:
        return html`<div>Home</div>`;
    }
  }

  function update({ modules, router }) {
    const currentRoute = router.getCurrentRoute();

    render(template(currentRoute), root);
  }
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
