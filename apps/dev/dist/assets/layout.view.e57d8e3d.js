import{A as s,y as t}from"./lit-html.9b9017eb.js";const n="_app_1ah5x_1",c="_sidebar_1ah5x_10",e="_top_1ah5x_14",v="_main_1ah5x_21",a={app:n,sidebar:c,top:e,main:v};function u(o,i){s(d(i.layout.roots),o);function d(r){return t`
      <div class=${a.app}>
        <div class=${a.top}>
          <div data-crux-root="top-left"></div>
          ${i.auth.machineState==="signupForm"?t`<div class=${a.right} data-crux-root="sign-up-form"></div>`:null}
          <div>
            <div data-crux-root="user-nav"></div>
            <div data-crux-root="dark-mode-toggle"></div>
          </div>
        </div>
        ${r.sidebar?t`<div class=${a.sidebar} data-crux-root="sidebar"></div>`:null}
        
        <div class=${a.main} data-crux-root="main"></div>
        <div data-crux-root="toast"></div>
      </div>
    `}}export{u as createLayoutView};
