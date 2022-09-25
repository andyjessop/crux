import{b as o,x as l,A as u,y as h}from"./lit-html.9b9017eb.js";import{o as d}from"./map.a4f06f37.js";import{i as f,t as m,e as p}from"./directive.9b57a945.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class r extends f{constructor(t){if(super(t),this.it=o,t.type!==m.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===o||t==null)return this._t=void 0,this.it=t;if(t===l)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const i=[t];return i.raw=i,this._t={_$litType$:this.constructor.resultType,strings:i,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;const v=p(r);function T(s,t,i){const{alerts:n}=t;u(c(n),s);function c(a){return d(a,e=>h`
      <sl-alert
        id=${e.id}
        variant=${e.variant}
        duration=${e.duration}
        closable>
        <sl-icon
          slot="icon"
          name="info-circle"></sl-icon>
        ${v(e.html)}
      </sl-alert>`)}}export{T as createToastView};
