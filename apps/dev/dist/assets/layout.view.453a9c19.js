import{A as d,y as t}from"./lit-html.9b9017eb.js";const c="_app_1ah5x_1",n="_sidebar_1ah5x_10",e="_top_1ah5x_14",p="_main_1ah5x_21",a={app:c,sidebar:n,top:e,main:p};function u(o,i){d(s(i.layout.roots),o);function s(r){return t`
      <div class=${a.app}>
        <div class=${a.top}>
          <div class=${a.left} data-crux-root="top-left"></div>
          ${i.auth.machineState==="signupForm"?t`<div class=${a.right} data-crux-root="sign-up-form"></div>`:null}
          <div class=${a.right} data-crux-root="user-nav"></div>
        </div>
        ${r.sidebar?t`<div class=${a.sidebar} data-crux-root="sidebar"></div>`:null}
        
        <div class=${a.main} data-crux-root="main"></div>
        <div data-crux-root="toast"></div>
      </div>
    `}}export{u as createLayoutView};
