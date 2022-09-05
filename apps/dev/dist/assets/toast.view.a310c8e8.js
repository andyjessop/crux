import{b as c,x as u,A as h,y as d}from"./lit-html.9b9017eb.js";import{i as f,t as m,e as p,o as v}from"./directive.79f3ee9a.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class r extends f{constructor(t){if(super(t),this.it=c,t.type!==m.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===c||t==null)return this._t=void 0,this.it=t;if(t===u)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const i=[t];return i.raw=i,this._t={_$litType$:this.constructor.resultType,strings:i,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;const $=p(r);function T(o,t,i){const{alerts:n}=t,{toastAlert:a}=i;h(l(n),o);for(const s of n)a(s);function l(s){return v(s,e=>d`
      <sl-alert
        id=${e.id}
        variant=${e.variant}
        duration=${e.duration}
        closable>
        <sl-icon
          slot="icon"
          name="info-circle"></sl-icon>
        ${$(e.html)}
      </sl-alert>`)}}export{T as createToastView};
