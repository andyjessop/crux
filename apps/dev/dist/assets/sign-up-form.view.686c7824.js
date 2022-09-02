import{A as g,y as o}from"./index.9b704175.js";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*f(s,u){if(s!==void 0){let a=0;for(const e of s)yield u(e,a++)}}function $(s,u,a){const{email:e,password:n,emailValue:r}=u,{onChangeEmail:l,onChangePassword:m,onSubmit:c}=a;if(e==null||n===void 0)return null;g(d(),s);function p(){try{const i=document.getElementById("sign-up-form-email").value,t=document.getElementById("sign-up-form-password").value;c(i,t)}catch{}}function d(){var i;return o`
      <form>
        <input
          id="sign-up-form-email"
          type="text"
          name="${e.name}"
          @input=${t=>l(t.target.value)}
          .value="${r}">
        ${e.errorMessages.length&&!e.isPristine?o`${f(e.errorMessages,t=>o`<div>${t}</div>`)}`:null}
        <input
          id="sign-up-form-password"
          type="password"
          name="${n.name}"
          @input=${t=>m(t.target.value)}
          .value="${n.value}">
        ${((i=n.successMessage)==null?void 0:i.length)&&!n.isPristine?o`<div>${n.successMessage}</div>`:null}
        <button @click=${p}>Submit</button>
      </form>
    `}}export{$ as createSignupFormView};
