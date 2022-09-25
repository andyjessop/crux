import{b as r}from"./lit-html.9b9017eb.js";import{i as v,t as $,e as a}from"./directive.9b57a945.js";/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const u=s=>s.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=(s,t)=>{var i,e;const o=s._$AN;if(o===void 0)return!1;for(const n of o)(e=(i=n)._$AO)===null||e===void 0||e.call(i,t,!1),l(n,t);return!0},h=s=>{let t,i;do{if((t=s._$AM)===void 0)break;i=t._$AN,i.delete(s),s=t}while((i==null?void 0:i.size)===0)},c=s=>{for(let t;t=s._$AM;s=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(s))break;i.add(s),f(t)}};function _(s){this._$AN!==void 0?(h(this),this._$AM=s,c(this)):this._$AM=s}function A(s,t=!1,i=0){const e=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(e))for(let n=i;n<e.length;n++)l(e[n],!1),h(e[n]);else e!=null&&(l(e,!1),h(e));else l(this,s)}const f=s=>{var t,i,e,o;s.type==$.CHILD&&((t=(e=s)._$AP)!==null&&t!==void 0||(e._$AP=A),(i=(o=s)._$AQ)!==null&&i!==void 0||(o._$AQ=_))};class p extends v{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,e){super._$AT(t,i,e),c(this),this.isConnected=t._$AU}_$AO(t,i=!0){var e,o;t!==this.isConnected&&(this.isConnected=t,t?(e=this.reconnected)===null||e===void 0||e.call(this):(o=this.disconnected)===null||o===void 0||o.call(this)),i&&(l(this,t),h(this))}setValue(t){if(u(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=()=>new Y;class Y{}const d=new WeakMap,m=a(class extends p{render(s){return r}update(s,[t]){var i;const e=t!==this.Y;return e&&this.Y!==void 0&&this.rt(void 0),(e||this.lt!==this.dt)&&(this.Y=t,this.ct=(i=s.options)===null||i===void 0?void 0:i.host,this.rt(this.dt=s.element)),r}rt(s){var t;if(typeof this.Y=="function"){const i=(t=this.ct)!==null&&t!==void 0?t:globalThis;let e=d.get(i);e===void 0&&(e=new WeakMap,d.set(i,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ct,void 0),e.set(this.Y,s),s!==void 0&&this.Y.call(this.ct,s)}else this.Y.value=s}get lt(){var s,t,i;return typeof this.Y=="function"?(t=d.get((s=this.ct)!==null&&s!==void 0?s:globalThis))===null||t===void 0?void 0:t.get(this.Y):(i=this.Y)===null||i===void 0?void 0:i.value}disconnected(){this.lt===this.dt&&this.rt(void 0)}reconnected(){this.rt(this.dt)}});export{N as e,m as n};
