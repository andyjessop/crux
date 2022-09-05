import{b as g,A as M,y as d}from"./lit-html.9b9017eb.js";import{i as y,t as N,e as P,o as S}from"./directive.79f3ee9a.js";/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=(e,t)=>{var s,i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=(s=o)._$AO)===null||i===void 0||i.call(s,t,!1),r(o,t);return!0},u=e=>{let t,s;do{if((t=e._$AM)===void 0)break;s=t._$AN,s.delete(e),e=t}while((s==null?void 0:s.size)===0)},A=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(s===void 0)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),D(t)}};function x(e){this._$AN!==void 0?(u(this),this._$AM=e,A(this)):this._$AM=e}function T(e,t=!1,s=0){const i=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(i))for(let o=s;o<i.length;o++)r(i[o],!1),u(i[o]);else i!=null&&(r(i,!1),u(i));else r(this,e)}const D=e=>{var t,s,i,n;e.type==N.CHILD&&((t=(i=e)._$AP)!==null&&t!==void 0||(i._$AP=T),(s=(n=e)._$AQ)!==null&&s!==void 0||(n._$AQ=x))};class H extends y{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,s,i){super._$AT(t,s,i),A(this),this.isConnected=t._$AU}_$AO(t,s=!0){var i,n;t!==this.isConnected&&(this.isConnected=t,t?(i=this.reconnected)===null||i===void 0||i.call(this):(n=this.disconnected)===null||n===void 0||n.call(this)),s&&(r(this,t),u(this))}setValue(t){if(k(this._$Ct))this._$Ct._$AI(t,this);else{const s=[...this._$Ct._$AH];s[this._$Ci]=t,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const h=()=>new I;class I{}const c=new WeakMap,v=P(class extends H{render(e){return g}update(e,[t]){var s;const i=t!==this.Y;return i&&this.Y!==void 0&&this.rt(void 0),(i||this.lt!==this.dt)&&(this.Y=t,this.ct=(s=e.options)===null||s===void 0?void 0:s.host,this.rt(this.dt=e.element)),g}rt(e){var t;if(typeof this.Y=="function"){const s=(t=this.ct)!==null&&t!==void 0?t:globalThis;let i=c.get(s);i===void 0&&(i=new WeakMap,c.set(s,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ct,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ct,e)}else this.Y.value=e}get lt(){var e,t,s;return typeof this.Y=="function"?(t=c.get((e=this.ct)!==null&&e!==void 0?e:globalThis))===null||t===void 0?void 0:t.get(this.Y):(s=this.Y)===null||s===void 0?void 0:s.value}disconnected(){this.lt===this.dt&&this.rt(void 0)}reconnected(){this.rt(this.dt)}});function E(e,t,s){const{email:i,password:n}=t,{onCancel:o,onChangeEmail:m,onChangePassword:b,onSubmit:C}=s;if(i==null||n===void 0)return null;const $=h(),f=h(),p=h();M(w(),e);function Y(a){var l,_;a.preventDefault(),C((l=f.value)==null?void 0:l.value,(_=p.value)==null?void 0:_.value)}$.value.addEventListener("sl-request-close",a=>{o()});function w(){var a;return d`
    <sl-dialog
      ${v($)}
      label="Dialog"
      class="dialog-focus"
      open>
      <form @submit=${Y}>
        <sl-input
          ${v(f)}
          type="text"
          name="${i.name}"
          @input=${l=>m(l.target.value)}
          .value="${i.value}"></sl-input>
        ${i.errorMessages.length&&!i.isPristine?d`${S(i.errorMessages,l=>d`<div>${l}</div>`)}`:null}
        <sl-input
          ${v(p)}
          type="password"
          name="${n.name}"
          @input=${l=>b(l.target.value)}
          .value="${n.value}"></sl-input>
        ${((a=n.successMessage)==null?void 0:a.length)&&!n.isPristine?d`<div>${n.successMessage}</div>`:null}
        <sl-button type="submit">Sign up</sl-button>
      </form>
    </sl-dialog>
    `}}export{E as createSignupFormView};
