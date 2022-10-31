import{b as u,x as h,y as v,A as g}from"./index.8cad4e1f.js";import{i as _,t as f,e as y,c as w}from"./repeat.4291924a.js";import{c as m}from"./classes.1cc075b4.js";const b="_alert_kr0p3_1",$={alert:b};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class l extends _{constructor(t){if(super(t),this.it=u,t.type!==f.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===u||t==null)return this._t=void 0,this.it=t;if(t===h)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const r=[t];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}l.directiveName="unsafeHTML",l.resultType=1;const T=y(l);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=y(class extends _{constructor(s){var t;if(super(s),s.type!==f.ATTRIBUTE||s.name!=="style"||((t=s.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((t,r)=>{const e=s[r];return e==null?t:t+`${r=r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`},"")}update(s,[t]){const{style:r}=s.element;if(this.vt===void 0){this.vt=new Set;for(const e in t)this.vt.add(e);return this.render(t)}this.vt.forEach(e=>{t[e]==null&&(this.vt.delete(e),e.includes("-")?r.removeProperty(e):r[e]="")});for(const e in t){const n=t[e];n!=null&&(this.vt.add(e),e.includes("-")?r.setProperty(e,n):r[e]=n)}return h}}),x="_alert_1jhya_1",E="_danger_1jhya_7",k="_info_1jhya_10",N="_success_1jhya_13",A="_warning_1jhya_16",d={alert:x,danger:E,info:k,success:N,warning:A};function C({animationDuration:s,html:t,id:r,removing:e,text:n,variant:o},c,a){const i=m(d.alert,d[o],a,"animate__animated",e?"animate__fadeOutRight":""),p=j({"--animate-duration":`${(s!=null?s:0)/1e3}s`});return v` <div class=${i} role="alert" style=${p}>
    ${t?T(t):n}
    <button @click=${()=>c(r)}>x</button>
  </div>`}function L(s){return function(r,e){const{alerts:n}=r,{close:o}=e;g(c(n),s);function c(a){return w(a,i=>i.id,i=>C(i,o,m($.alert," animate__fadeInRight")))}}}export{L as toasterView};
