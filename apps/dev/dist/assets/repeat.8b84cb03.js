import{z as m,x as y}from"./lit-html.c1443299.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},U=e=>(...n)=>({_$litDirective$:e,values:n});class b{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,A){this._$Ct=n,this._$AM=t,this._$Ci=A}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{H:C}=m,B=()=>document.createComment(""),v=(e,n,t)=>{var A;const u=e._$AA.parentNode,r=n===void 0?e._$AB:n._$AA;if(t===void 0){const l=u.insertBefore(B(),r),c=u.insertBefore(B(),r);t=new C(l,c,e,e.options)}else{const l=t._$AB.nextSibling,c=t._$AM,$=c!==e;if($){let o;(A=t._$AQ)===null||A===void 0||A.call(t,e),t._$AM=e,t._$AP!==void 0&&(o=e._$AU)!==c._$AU&&t._$AP(o)}if(l!==r||$){let o=t._$AA;for(;o!==l;){const h=o.nextSibling;u.insertBefore(o,r),o=h}}}return t},d=(e,n,t=e)=>(e._$AI(n,t),e),H={},I=(e,n=H)=>e._$AH=n,P=e=>e._$AH,x=e=>{var n;(n=e._$AP)===null||n===void 0||n.call(e,!1,!0);let t=e._$AA;const A=e._$AB.nextSibling;for(;t!==A;){const u=t.nextSibling;t.remove(),t=u}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const g=(e,n,t)=>{const A=new Map;for(let u=n;u<=t;u++)A.set(e[u],u);return A},w=U(class extends b{constructor(e){if(super(e),e.type!==M.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,n,t){let A;t===void 0?t=n:n!==void 0&&(A=n);const u=[],r=[];let l=0;for(const c of e)u[l]=A?A(c,l):l,r[l]=t(c,l),l++;return{values:r,keys:u}}render(e,n,t){return this.ht(e,n,t).values}update(e,[n,t,A]){var u;const r=P(e),{values:l,keys:c}=this.ht(n,t,A);if(!Array.isArray(r))return this.ut=c,l;const $=(u=this.ut)!==null&&u!==void 0?u:this.ut=[],o=[];let h,E,s=0,_=r.length-1,i=0,f=l.length-1;for(;s<=_&&i<=f;)if(r[s]===null)s++;else if(r[_]===null)_--;else if($[s]===c[i])o[i]=d(r[s],l[i]),s++,i++;else if($[_]===c[f])o[f]=d(r[_],l[f]),_--,f--;else if($[s]===c[f])o[f]=d(r[s],l[f]),v(e,o[f+1],r[s]),s++,f--;else if($[_]===c[i])o[i]=d(r[_],l[i]),v(e,r[s],r[_]),_--,i++;else if(h===void 0&&(h=g(c,i,f),E=g($,s,_)),h.has($[s]))if(h.has($[_])){const a=E.get(c[i]),p=a!==void 0?r[a]:null;if(p===null){const T=v(e,r[s]);d(T,l[i]),o[i]=T}else o[i]=d(p,l[i]),v(e,r[s],p),r[a]=null;i++}else x(r[_]),_--;else x(r[s]),s++;for(;i<=f;){const a=v(e,o[f+1]);d(a,l[i]),o[i++]=a}for(;s<=_;){const a=r[s++];a!==null&&x(a)}return this.ut=c,I(e,o),y}});export{w as c,U as e,b as i,M as t};
