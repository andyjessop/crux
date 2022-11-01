(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerpolicy&&(o.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?o.credentials="include":i.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const ne="modulepreload",re=function(n){return"/"+n},$t={},E=function(t,e,r){if(!e||e.length===0)return t();const i=document.getElementsByTagName("link");return Promise.all(e.map(o=>{if(o=re(o),o in $t)return;$t[o]=!0;const s=o.endsWith(".css"),c=s?'[rel="stylesheet"]':"";if(!!r)for(let d=i.length-1;d>=0;d--){const l=i[d];if(l.href===o&&(!s||l.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${c}`))return;const u=document.createElement("link");if(u.rel=s?"stylesheet":ne,s||(u.as="script",u.crossOrigin=""),u.href=o,document.head.appendChild(u),s)return new Promise((d,l)=>{u.addEventListener("load",d),u.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>t())};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=window,dt=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),Et=new WeakMap;class Mt{constructor(t,e,r){if(this._$cssResult$=!0,r!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(dt&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Et.set(e,t))}return t}toString(){return this.cssText}}const ie=n=>new Mt(typeof n=="string"?n:n+"",void 0,ht),et=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((r,i,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new Mt(e,n,ht)},oe=(n,t)=>{dt?n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{const r=document.createElement("style"),i=Z.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,n.appendChild(r)})},At=dt?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ie(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var it;const Q=window,wt=Q.trustedTypes,se=wt?wt.emptyScript:"",St=Q.reactiveElementPolyfillSupport,lt={toAttribute(n,t){switch(t){case Boolean:n=n?se:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Ht=(n,t)=>t!==n&&(t==t||n==n),ot={attribute:!0,type:String,converter:lt,reflect:!1,hasChanged:Ht};class U extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;(e=this.h)!==null&&e!==void 0||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,r)=>{const i=this._$Ep(r,e);i!==void 0&&(this._$Ev.set(i,r),t.push(i))}),t}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const r=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,r,e);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){return{get(){return this[e]},set(i){const o=this[t];this[e]=i,this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||ot}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,r=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of r)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)e.unshift(At(i))}else t!==void 0&&e.push(At(t));return e}static _$Ep(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,r;((e=this._$ES)!==null&&e!==void 0?e:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)===null||r===void 0||r.call(t))}removeController(t){var e;(e=this._$ES)===null||e===void 0||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return oe(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(e=>{var r;return(r=e.hostConnected)===null||r===void 0?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(e=>{var r;return(r=e.hostDisconnected)===null||r===void 0?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EO(t,e,r=ot){var i;const o=this.constructor._$Ep(t,r);if(o!==void 0&&r.reflect===!0){const s=(((i=r.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?r.converter:lt).toAttribute(e,r.type);this._$El=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$El=null}}_$AK(t,e){var r;const i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){const s=i.getPropertyOptions(o),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?s.converter:lt;this._$El=o,this[o]=c.fromAttribute(e,s.type),this._$El=null}}requestUpdate(t,e,r){let i=!0;t!==void 0&&(((r=r||this.constructor.getPropertyOptions(t)).hasChanged||Ht)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(r)):this._$Ek()}catch(i){throw e=!1,this._$Ek(),i}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$ES)===null||e===void 0||e.forEach(r=>{var i;return(i=r.hostUpdated)===null||i===void 0?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,r)=>this._$EO(r,this[r],e)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}U.finalized=!0,U.elementProperties=new Map,U.elementStyles=[],U.shadowRootOptions={mode:"open"},St==null||St({ReactiveElement:U}),((it=Q.reactiveElementVersions)!==null&&it!==void 0?it:Q.reactiveElementVersions=[]).push("1.4.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var st;const G=window,k=G.trustedTypes,bt=k?k.createPolicy("lit-html",{createHTML:n=>n}):void 0,T=`lit$${(Math.random()+"").slice(9)}$`,ft="?"+T,ae=`<${ft}>`,M=document,z=(n="")=>M.createComment(n),q=n=>n===null||typeof n!="object"&&typeof n!="function",Vt=Array.isArray,jt=n=>Vt(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ot=/-->/g,Pt=/>/g,x=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Ct=/"/g,Bt=/^(?:script|style|textarea|title)$/i,ce=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),hn=ce(1),H=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Tt=new WeakMap,ue=(n,t,e)=>{var r,i;const o=(r=e==null?void 0:e.renderBefore)!==null&&r!==void 0?r:t;let s=o._$litPart$;if(s===void 0){const c=(i=e==null?void 0:e.renderBefore)!==null&&i!==void 0?i:null;o._$litPart$=s=new V(t.insertBefore(z(),c),c,void 0,e!=null?e:{})}return s._$AI(n),s},L=M.createTreeWalker(M,129,null,!1),zt=(n,t)=>{const e=n.length-1,r=[];let i,o=t===2?"<svg>":"",s=B;for(let a=0;a<e;a++){const u=n[a];let d,l,f=-1,h=0;for(;h<u.length&&(s.lastIndex=h,l=s.exec(u),l!==null);)h=s.lastIndex,s===B?l[1]==="!--"?s=Ot:l[1]!==void 0?s=Pt:l[2]!==void 0?(Bt.test(l[2])&&(i=RegExp("</"+l[2],"g")),s=x):l[3]!==void 0&&(s=x):s===x?l[0]===">"?(s=i!=null?i:B,f=-1):l[1]===void 0?f=-2:(f=s.lastIndex-l[2].length,d=l[1],s=l[3]===void 0?x:l[3]==='"'?Ct:Rt):s===Ct||s===Rt?s=x:s===Ot||s===Pt?s=B:(s=x,i=void 0);const _=s===x&&n[a+1].startsWith("/>")?" ":"";o+=s===B?u+ae:f>=0?(r.push(d),u.slice(0,f)+"$lit$"+u.slice(f)+T+_):u+T+(f===-2?(r.push(void 0),a):_)}const c=o+(n[e]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return[bt!==void 0?bt.createHTML(c):c,r]};class F{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let o=0,s=0;const c=t.length-1,a=this.parts,[u,d]=zt(t,e);if(this.el=F.createElement(u,r),L.currentNode=this.el.content,e===2){const l=this.el.content,f=l.firstChild;f.remove(),l.append(...f.childNodes)}for(;(i=L.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes()){const l=[];for(const f of i.getAttributeNames())if(f.endsWith("$lit$")||f.startsWith(T)){const h=d[s++];if(l.push(f),h!==void 0){const _=i.getAttribute(h.toLowerCase()+"$lit$").split(T),p=/([.?@])?(.*)/.exec(h);a.push({type:1,index:o,name:p[2],strings:_,ctor:p[1]==="."?Ft:p[1]==="?"?Wt:p[1]==="@"?Kt:W})}else a.push({type:6,index:o})}for(const f of l)i.removeAttribute(f)}if(Bt.test(i.tagName)){const l=i.textContent.split(T),f=l.length-1;if(f>0){i.textContent=k?k.emptyScript:"";for(let h=0;h<f;h++)i.append(l[h],z()),L.nextNode(),a.push({type:2,index:++o});i.append(l[f],z())}}}else if(i.nodeType===8)if(i.data===ft)a.push({type:2,index:o});else{let l=-1;for(;(l=i.data.indexOf(T,l+1))!==-1;)a.push({type:7,index:o}),l+=T.length-1}o++}}static createElement(t,e){const r=M.createElement("template");return r.innerHTML=t,r}}function N(n,t,e=n,r){var i,o,s,c;if(t===H)return t;let a=r!==void 0?(i=e._$Cl)===null||i===void 0?void 0:i[r]:e._$Cu;const u=q(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==u&&((o=a==null?void 0:a._$AO)===null||o===void 0||o.call(a,!1),u===void 0?a=void 0:(a=new u(n),a._$AT(n,e,r)),r!==void 0?((s=(c=e)._$Cl)!==null&&s!==void 0?s:c._$Cl=[])[r]=a:e._$Cu=a),a!==void 0&&(t=N(n,a._$AS(n,t.values),a,r)),t}class qt{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:r},parts:i}=this._$AD,o=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:M).importNode(r,!0);L.currentNode=o;let s=L.nextNode(),c=0,a=0,u=i[0];for(;u!==void 0;){if(c===u.index){let d;u.type===2?d=new V(s,s.nextSibling,this,t):u.type===1?d=new u.ctor(s,u.name,u.strings,this,t):u.type===6&&(d=new Jt(s,this,t)),this.v.push(d),u=i[++a]}c!==(u==null?void 0:u.index)&&(s=L.nextNode(),c++)}return o}m(t){let e=0;for(const r of this.v)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class V{constructor(t,e,r,i){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$C_=(o=i==null?void 0:i.isConnected)===null||o===void 0||o}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$C_}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),q(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==H&&this.$(t):t._$litType$!==void 0?this.T(t):t.nodeType!==void 0?this.k(t):jt(t)?this.O(t):this.$(t)}S(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}$(t){this._$AH!==w&&q(this._$AH)?this._$AA.nextSibling.data=t:this.k(M.createTextNode(t)),this._$AH=t}T(t){var e;const{values:r,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=F.createElement(i.h,this.options)),i);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===o)this._$AH.m(r);else{const s=new qt(o,this),c=s.p(this.options);s.m(r),this.k(c),this._$AH=s}}_$AC(t){let e=Tt.get(t.strings);return e===void 0&&Tt.set(t.strings,e=new F(t)),e}O(t){Vt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const o of t)i===e.length?e.push(r=new V(this.S(z()),this.S(z()),this,this.options)):r=e[i],r._$AI(o),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$C_=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class W{constructor(t,e,r,i,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=w}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,r,i){const o=this.strings;let s=!1;if(o===void 0)t=N(this,t,e,0),s=!q(t)||t!==this._$AH&&t!==H,s&&(this._$AH=t);else{const c=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=N(this,c[r+a],e,a),u===H&&(u=this._$AH[a]),s||(s=!q(u)||u!==this._$AH[a]),u===w?t=w:t!==w&&(t+=(u!=null?u:"")+o[a+1]),this._$AH[a]=u}s&&!i&&this.P(t)}P(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class Ft extends W{constructor(){super(...arguments),this.type=3}P(t){this.element[this.name]=t===w?void 0:t}}const le=k?k.emptyScript:"";class Wt extends W{constructor(){super(...arguments),this.type=4}P(t){t&&t!==w?this.element.setAttribute(this.name,le):this.element.removeAttribute(this.name)}}class Kt extends W{constructor(t,e,r,i,o){super(t,e,r,i,o),this.type=5}_$AI(t,e=this){var r;if((t=(r=N(this,t,e,0))!==null&&r!==void 0?r:w)===H)return;const i=this._$AH,o=t===w&&i!==w||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==w&&(i===w||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;typeof this._$AH=="function"?this._$AH.call((r=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&r!==void 0?r:this.element,t):this._$AH.handleEvent(t)}}class Jt{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}}const fn={A:"$lit$",M:T,C:ft,L:1,R:zt,D:qt,V:jt,I:N,H:V,N:W,U:Wt,B:Kt,F:Ft,W:Jt},It=G.litHtmlPolyfillSupport;It==null||It(F,V),((st=G.litHtmlVersions)!==null&&st!==void 0?st:G.litHtmlVersions=[]).push("2.3.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var at,ct;class X extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const r=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=r.firstChild),r}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ue(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return H}}X.finalized=!0,X._$litElement$=!0,(at=globalThis.litElementHydrateSupport)===null||at===void 0||at.call(globalThis,{LitElement:X});const xt=globalThis.litElementPolyfillSupport;xt==null||xt({LitElement:X});((ct=globalThis.litElementVersions)!==null&&ct!==void 0?ct:globalThis.litElementVersions=[]).push("3.2.2");const pn=et``,vn=et``,_n=et``,gn=et``;function de(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function Nt(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(n,i).enumerable})),e.push.apply(e,r)}return e}function Dt(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?Nt(Object(e),!0).forEach(function(r){de(n,r,e[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):Nt(Object(e)).forEach(function(r){Object.defineProperty(n,r,Object.getOwnPropertyDescriptor(e,r))})}return n}function b(n){return"Minified Redux error #"+n+"; visit https://redux.js.org/Errors?code="+n+" for the full message or use the non-minified dev environment for full errors. "}var Ut=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}(),ut=function(){return Math.random().toString(36).substring(7).split("").join(".")},Y={INIT:"@@redux/INIT"+ut(),REPLACE:"@@redux/REPLACE"+ut(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+ut()}};function he(n){if(typeof n!="object"||n===null)return!1;for(var t=n;Object.getPrototypeOf(t)!==null;)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(n)===t}function Zt(n,t,e){var r;if(typeof t=="function"&&typeof e=="function"||typeof e=="function"&&typeof arguments[3]=="function")throw new Error(b(0));if(typeof t=="function"&&typeof e>"u"&&(e=t,t=void 0),typeof e<"u"){if(typeof e!="function")throw new Error(b(1));return e(Zt)(n,t)}if(typeof n!="function")throw new Error(b(2));var i=n,o=t,s=[],c=s,a=!1;function u(){c===s&&(c=s.slice())}function d(){if(a)throw new Error(b(3));return o}function l(p){if(typeof p!="function")throw new Error(b(4));if(a)throw new Error(b(5));var m=!0;return u(),c.push(p),function(){if(!!m){if(a)throw new Error(b(6));m=!1,u();var v=c.indexOf(p);c.splice(v,1),s=null}}}function f(p){if(!he(p))throw new Error(b(7));if(typeof p.type>"u")throw new Error(b(8));if(a)throw new Error(b(9));try{a=!0,o=i(o,p)}finally{a=!1}for(var m=s=c,y=0;y<m.length;y++){var v=m[y];v()}return p}function h(p){if(typeof p!="function")throw new Error(b(10));i=p,f({type:Y.REPLACE})}function _(){var p,m=l;return p={subscribe:function(v){if(typeof v!="object"||v===null)throw new Error(b(11));function $(){v.next&&v.next(d())}$();var P=m($);return{unsubscribe:P}}},p[Ut]=function(){return this},p}return f({type:Y.INIT}),r={dispatch:f,subscribe:l,getState:d,replaceReducer:h},r[Ut]=_,r}var fe=Zt;function pe(n){Object.keys(n).forEach(function(t){var e=n[t],r=e(void 0,{type:Y.INIT});if(typeof r>"u")throw new Error(b(12));if(typeof e(void 0,{type:Y.PROBE_UNKNOWN_ACTION()})>"u")throw new Error(b(13))})}function Lt(n){for(var t=Object.keys(n),e={},r=0;r<t.length;r++){var i=t[r];typeof n[i]=="function"&&(e[i]=n[i])}var o=Object.keys(e),s;try{pe(e)}catch(c){s=c}return function(a,u){if(a===void 0&&(a={}),s)throw s;for(var d=!1,l={},f=0;f<o.length;f++){var h=o[f],_=e[h],p=a[h],m=_(p,u);if(typeof m>"u")throw u&&u.type,new Error(b(14));l[h]=m,d=d||m!==p}return d=d||o.length!==Object.keys(a).length,d?l:a}}function pt(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return t.length===0?function(r){return r}:t.length===1?t[0]:t.reduce(function(r,i){return function(){return r(i.apply(void 0,arguments))}})}function ve(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return function(r){return function(){var i=r.apply(void 0,arguments),o=function(){throw new Error(b(15))},s={getState:i.getState,dispatch:function(){return o.apply(void 0,arguments)}},c=t.map(function(a){return a(s)});return o=pt.apply(void 0,c)(i.dispatch),Dt(Dt({},i),{},{dispatch:o})}}}const _e=()=>{const n=[];return{middleware:({getState:t,dispatch:e})=>r=>i=>{const o={getState:t,dispatch:c=>e(c)},s=n.map(c=>c(o));return pt(...s)(r)(i)},add:(t,e)=>(e===void 0?n.push(t):n.splice(e,0,t),()=>{const r=n.findIndex(i=>i===t);r<0||n.splice(r,1)}),getIndex:t=>n.findIndex(e=>e===t)}},ge=()=>{const n=new Map;let t=r=>r||{};return{add:e,reducer:(r,i)=>t(r,i)};function e(r,i){return n.set(r,i),t=Lt(Object.fromEntries(n)),function(){n.delete(r),t=Lt(Object.fromEntries(n))}}};function me({isDev:n}={isDev:!0}){const t=_e(),e=ge(),r=ve(t.middleware),i=n&&typeof window<"u"&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||pt,o=fe(e.reducer,{},i(r));return{addMiddleware:t.add,addReducer:(a,u)=>{const d=e.add(a,u);return o.dispatch({type:"__cruxRegistry/ADD_REDUCER",payload:{id:a}}),d},...o}}function ye({root:n,slices:t,subscriptions:e=[],views:r},{emitter:i,store:o=me()}={}){n||console.info("No root element provided. Running in headless mode.");const s=l=>f=>async h=>{var P,A;if(f(h),h.type==="__cruxRegistry/ADD_REDUCER")return;const _=l.getState();i==null||i.emit("afterReducer",{action:h,state:_});const p=[];for(const g of t){g.getStore()||g.bindStore(o);const S=g.getUnregister(),O=(A=(P=g.shouldBeEnabled)==null?void 0:P.call(g,l.getState()))!=null?A:!0;S&&!O&&S(),!S&&O&&p.push(g)}await Promise.all(p.map(g=>g.getInstance())),i==null||i.emit("afterSlices",{action:h,state:_});const m=r.find(g=>g.root==="root");if(!m)throw new Error("No layout view found");const y=n!=null?n:{id:"root"};await m.render(y,l.getState()),i==null||i.emit("afterLayout",{action:h,state:_});const v=[];for(const g of r)if(g.root!=="root"&&g.root){const S=document.querySelector(`[data-crux-root=${g.root}]`);S&&v.push({view:g,root:S})}const $=l.getState();await Promise.all(v.map(({view:g,root:S})=>g.render(S,$))),i==null||i.emit("afterViews",{action:h,state:_});for(const g of e)g.runSubscription(l.getState());i==null||i.emit("afterSubscriptions",{action:h,state:_})};return o.addMiddleware(s),o.dispatch({type:"xapp/init"}),{...i,addSlice:a,addSubscription:d,addView:u,store:o};function c(l,f){return l.push(f),()=>{const h=l.indexOf(f);h>-1&&l.splice(h,1)}}function a(l){c(t,l)}function u(l){c(r,l)}function d(l){c(e,l)}}function C(n,t={deps:[]}){const{deps:e}=t;let r,i;return{getAPI:o,getInstance:o,instance:r,promise:i};async function o(){if(r)return r;const s=await Promise.all(e.map(a=>a.getAPI())),c=n(...s);return c instanceof Promise?(c.then(a=>{r=a}),c):(r=c,r)}}function $e(n=10){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return new Array(n).fill(0).reduce(e=>e+t.charAt(Math.floor(Math.random()*t.length)),"")}function j(n,t={deps:[],shouldBeEnabled:()=>!0,name:$e()}){const{deps:e,shouldBeEnabled:r,name:i}=t;let o,s,c,a;return{bindStore:u,getAPI:l,getInstance:d,getPromise:()=>s,getStore:f,getUnregister:()=>a,name:i,register:h,selector:_,shouldBeEnabled:r,store:c};function u(p){c=p}async function d(){if(!c)throw new Error("Cannot get slice before binding store");return o||s||(s=new Promise((p,m)=>{Promise.all((e||[]).map(y=>y.getAPI())).then(y=>{const v=n(...y);v instanceof Promise?v.then($=>{o=$,($.middleware||$.reducer)&&!a&&h($.middleware,$.reducer),p(o)}).catch($=>{m($)}):(o=v,(v.middleware||v.reducer)&&!a&&h(v.middleware,v.reducer),p(o))})}),s)}async function l(){return(await d()).api}function f(){return c}function h(p,m){if(!p||!m)return;if(!c)throw new Error("Cannot get slice before binding store");let y,v;p&&(y=c.addMiddleware(p)),m&&(v=c.addReducer(i,m)),a=()=>{v==null||v(),y==null||y()}}function _(p){return p[i]}}function Ee(n,{deps:t}){const e=[];return{runSubscription:r,updateDeps:i};async function r(o){if(!!await i(o))return n(...e)}async function i(o){let s=!1;for(const[c,a]of t.entries())if(a.getAPI){const u=await a.getAPI();if(e[c]===u)continue;e[c]=u,s=!0}else{const u=await a(o);if(e[c]===u)continue;e[c]=u,s=!0}return s}}function K(n,t){const{actions:e,data:r,root:i}=t;let o,s,c,a,u;return{get:d,getCurrentData:()=>o,instance:s,promise:c,render:f,root:i,updateData:l};async function d(){if(s)return s;const h=n();return h instanceof Promise?(h.then(_=>{s=_}),h):(s=h,s)}function l(h){const _=r(h);return _!==o?(o=_,!0):!1}async function f(h,_){if(s||await d(),!s)throw new Error("Could not get view instance");if(!l(_)&&(h==null?void 0:h.childElementCount))return;const p=e?await e.getAPI():void 0;return u===h&&a||(a=s(h),u=h),a(o,p)}}const vt=j(()=>E(()=>import("./toaster.slice.2bb98d65.js"),["assets/toaster.slice.2bb98d65.js","assets/slice.10e6ddb0.js","assets/any.07715dce.js"]).then(n=>n.createToasterSlice("toaster")),{name:"toaster"}),Xt=C(n=>E(()=>import("./toaster.service.40d03603.js"),[]).then(t=>t.toaster(n)),{deps:[vt]}),Ae=K(()=>E(()=>import("./toaster.view.7d93f10e.js"),["assets/toaster.view.7d93f10e.js","assets/repeat.651517fd.js","assets/classes.1cc075b4.js","assets/toaster.view.3213bd9d.css"]).then(n=>n.toasterView),{actions:Xt,data:vt.selector,root:"toaster"});var tt="NOT_FOUND";function we(n){var t;return{get:function(r){return t&&n(t.key,r)?t.value:tt},put:function(r,i){t={key:r,value:i}},getEntries:function(){return t?[t]:[]},clear:function(){t=void 0}}}function Se(n,t){var e=[];function r(c){var a=e.findIndex(function(d){return t(c,d.key)});if(a>-1){var u=e[a];return a>0&&(e.splice(a,1),e.unshift(u)),u.value}return tt}function i(c,a){r(c)===tt&&(e.unshift({key:c,value:a}),e.length>n&&e.pop())}function o(){return e}function s(){e=[]}return{get:r,put:i,getEntries:o,clear:s}}var be=function(t,e){return t===e};function Oe(n){return function(e,r){if(e===null||r===null||e.length!==r.length)return!1;for(var i=e.length,o=0;o<i;o++)if(!n(e[o],r[o]))return!1;return!0}}function Pe(n,t){var e=typeof t=="object"?t:{equalityCheck:t},r=e.equalityCheck,i=r===void 0?be:r,o=e.maxSize,s=o===void 0?1:o,c=e.resultEqualityCheck,a=Oe(i),u=s===1?we(a):Se(s,a);function d(){var l=u.get(arguments);if(l===tt){if(l=n.apply(null,arguments),c){var f=u.getEntries(),h=f.find(function(_){return c(_.value,l)});h&&(l=h.value)}u.put(arguments,l)}return l}return d.clearCache=function(){return u.clear()},d}function Re(n){var t=Array.isArray(n[0])?n[0]:n;if(!t.every(function(r){return typeof r=="function"})){var e=t.map(function(r){return typeof r=="function"?"function "+(r.name||"unnamed")+"()":typeof r}).join(", ");throw new Error("createSelector expects all input-selectors to be functions, but received the following types: ["+e+"]")}return t}function Ce(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];var i=function(){for(var s=arguments.length,c=new Array(s),a=0;a<s;a++)c[a]=arguments[a];var u=0,d,l={memoizeOptions:void 0},f=c.pop();if(typeof f=="object"&&(l=f,f=c.pop()),typeof f!="function")throw new Error("createSelector expects an output function after the inputs, but received: ["+typeof f+"]");var h=l,_=h.memoizeOptions,p=_===void 0?e:_,m=Array.isArray(p)?p:[p],y=Re(c),v=n.apply(void 0,[function(){return u++,f.apply(null,arguments)}].concat(m)),$=n(function(){for(var A=[],g=y.length,S=0;S<g;S++)A.push(y[S].apply(null,arguments));return d=v.apply(null,A),d});return Object.assign($,{resultFunc:f,memoizedResultFunc:v,dependencies:y,lastResult:function(){return d},recomputations:function(){return u},resetRecomputations:function(){return u=0}}),$};return i}var D=Ce(Pe);const Qt={todos:"/todos"},nt=j(()=>E(()=>import("./router.slice.3fc4d0c7.js"),["assets/router.slice.3fc4d0c7.js","assets/slice.10e6ddb0.js","assets/any.07715dce.js","assets/get-route-from-url.1ff994d5.js"]).then(n=>n.createRouterSlice(Qt)),{name:"router"}),Te=C(n=>E(()=>import("./router.service.e58a80a8.js"),["assets/router.service.e58a80a8.js","assets/get-route-from-url.1ff994d5.js"]).then(t=>t.router(Qt,n)),{deps:[nt]});function Ie(n,t){var e;return{...n,todos:((e=t==null?void 0:t.route)==null?void 0:e.name)==="todos"}}const Gt=j(()=>E(()=>import("./layout.slice.c97d346f.js"),["assets/layout.slice.c97d346f.js","assets/slice.10e6ddb0.js"]).then(n=>n.createLayoutSlice("layout")),{name:"layout"}),xe=D([Gt.selector,nt.selector],Ie),Ne=K(()=>E(()=>import("./layout.view.eafc7eeb.js"),["assets/layout.view.eafc7eeb.js","assets/layout.view.cda307c7.css"]).then(n=>n.createLayoutView),{data:xe,root:"root"}),Yt=C(()=>E(()=>import("./cache.service.a25ce58d.js"),[]).then(n=>n.cache())),_t=j(n=>E(()=>import("./dark-mode.slice.b9fdc118.js"),["assets/dark-mode.slice.b9fdc118.js","assets/slice.10e6ddb0.js","assets/any.07715dce.js","assets/dark-mode.config.2f3f9c98.js"]).then(t=>t.createDarkModeSlice(n)),{deps:[Yt],name:"darkMode"}),De=C((n,t)=>E(()=>import("./dark-mode.service.bc3bf735.js"),["assets/dark-mode.service.bc3bf735.js","assets/dark-mode.config.2f3f9c98.js"]).then(e=>e.darkMode(n,t)),{deps:[_t,Yt]}),Ue=K(()=>E(()=>import("./dark-mode.view.4d0f3cae.js"),["assets/dark-mode.view.4d0f3cae.js","assets/classes.1cc075b4.js","assets/dark-mode.view.8371f802.css"]).then(n=>n.createDarkModeView),{actions:De,data:_t.selector,root:"dark-mode-toggle"});function Le(n){const{route:t}=n;return[{icon:"tasks",route:"todos",text:"Todos",active:(t==null?void 0:t.name)==="todos"}]}const ke=D(nt.selector,Le),Me=K(()=>E(()=>import("./nav.view.3a0b178a.js"),["assets/nav.view.3a0b178a.js","assets/repeat.651517fd.js","assets/classes.1cc075b4.js","assets/icon.126990a0.js","assets/nav.view.5fc893bf.css"]).then(n=>n.navView),{actions:Te,data:ke,root:"nav"});function He(n){return n.filter(t=>t.status==="to-do")}function Ve(n){return n.filter(t=>t.status==="in-progress")}function je(n){return n.filter(t=>t.status==="completed")}function Be(n,t,e){return[{icon:"bell",status:"to-do",tasks:n,title:"To Do"},{icon:"shipping-fast",status:"in-progress",tasks:t,title:"In Progress"},{icon:"check-circle",status:"completed",tasks:e,title:"Completed"}]}function ze(n,t){return{draggingTaskId:n.draggingTaskId,tasks:t}}function qe(){const n=[];return{emit:r,on:t,onAll:e,once:s,off:i,offAll:o};function t(c,a){const u={handler:a,type:c};return n.push(u),()=>i(c,a)}function e(c){const a={handler:c,type:"all"};n.push(a)}function r(c,a){let u;const d=[];for(u of n){if(u.type!==c&&u.type!=="all")continue;const l=u.handler(a);l!=null&&l.then&&d.push(l)}return Promise.all(d)}function i(c,a){const u=n.findIndex(d=>c===d.type&&a===d.handler);u!==-1&&n.splice(u,1)}function o(c){const a=n.findIndex(u=>u.type==="all"&&c===u.handler);a!==-1&&n.splice(a,1)}function s(c,a){const u={handler:(...d)=>{i(c,u.handler),a(...d)},type:c};n.push(u)}}function Fe(n){return function(e,r){const i=e||n;return r.type==="__crux-query__"?{...i,[r.meta.id]:{...i[r.meta.id],...r.payload}}:e||n}}function We(){const n=[];let t=!1;return{add:e,clear:r,entries:n,flush:i};function e(o,...s){let c=()=>{},a=()=>{};const u=new Promise((d,l)=>{a=d,c=l});return n.push({fn:o,params:s,reject:c,resolve:a}),u}function r(){t=!1,n.length=0}async function i(){if(t)return;const o=n[0];if(!!o){t=!0;try{const s=await o.fn(...o.params);return o.resolve(s),n.shift(),t=!1,i()}catch(s){o.reject(s)}}}}function Ke({fetchFn:n,fetchParams:t,getState:e,keepUnusedDataFor:r=60,maxRetryCount:i=3,pollingInterval:o=60,setState:s}){const c=We();let a=!1,u=!1,d=0,l=0,f,h;return{addSubscriber:_,mutate:y,refetch:$,removeSubscriber:P};function _(){l+=1,clearTimeout(f)}async function p(){a=!0,clearTimeout(h),s({loading:!0,updating:e().data!==null});try{const A=await n(...t);return s({data:A,loading:!1,updating:!1}),a=!1,o!==null&&v(),c.flush(),A}catch(A){s({error:A,loading:!1,updating:!1}),a=!1,c.flush()}}async function m(A,...g){u=!0;const{query:S,optimistic:O,options:I}=A,{refetchOnSuccess:rt}=I,yt=e();if(O){const R=O==null?void 0:O(...g),J=kt(R)?R(e().data):R;s({data:J,loading:!0,updating:yt.data!==null})}try{const R=await S(...g),J=kt(R)?await R(e().data):R;return s({data:A.options.refetchOnSuccess===!1?J:yt.data,loading:!1,updating:!1}),u=!1,d=0,rt?$():c.flush(),J}catch(R){if(s({error:R,loading:!1,updating:!1}),u=!1,d+=1,d===i)throw R;c.flush()}}async function y(A,...g){return a?c.add(m,A,...g):m(A,...g)}function v(){h=setTimeout(async()=>{$()},o*1e3)}async function $(){if(u)c.add(p);else return p()}async function P(){l-=1,l===0&&(f=setTimeout(async()=>{clearTimeout(h),s({data:null,error:null,loading:!1,updating:!1})},r))}}function kt(n){return typeof n=="function"}function Je(n="crux"){let t,e;const r=new Map;return{createResource:s,middleware:i,reducer:Fe({}),reducerId:n};function i(c){return(!t||!e)&&(t=a=>c.dispatch(a),e=c.getState),function(u){return function(l){u(l)}}}function o(c){return function(u){return t({meta:{id:c},payload:u,type:"__crux-query__"})}}function s(c,a){return{subscribe:u};function u(...d){var P,A,g,S;const l=Ze(c,d),f=qe();if(!r.has(l)){const O=o(l);r.set(l,Ke({fetchFn:a.query,fetchParams:d,getState:()=>v(e()),keepUnusedDataFor:(P=a.options)==null?void 0:P.keepUnusedDataFor,maxRetryCount:(A=a.options)==null?void 0:A.maxRetryCount,pollingInterval:(g=a.options)==null?void 0:g.pollingInterval,setState:O})),O({data:null,error:null,loading:!1,updating:!1})}const{addSubscriber:h,mutate:_,refetch:p,removeSubscriber:m}=r.get(l);return h(),((S=a.options)==null?void 0:S.lazy)===!1&&p(),{...y(),...f,getState:()=>v(e()),refetch:p,select:v,unsubscribe:$};function y(){const O={};return Object.keys(a.mutations).forEach(I=>{O[I]=async function(...rt){return await _(a.mutations[I],...rt)}}),O}function v(O){var I;return(I=O[n])==null?void 0:I[l]}function $(){m()}}}}function Ze(n,t){return t.length?`${n}|${t.map(e=>JSON.stringify(e)).join("|")}`:n}function Xe(){return Je("data")}const te=C(Xe),Qe=j(n=>E(()=>import("./data.slice.03e2913e.js"),[]).then(t=>t.dataSlice(n)),{deps:[te],name:"data"}),Ge=C(()=>E(()=>import("./env.service.06de621a.js"),[]).then(n=>n.env())),gt=j(()=>E(()=>import("./todos.slice.86815ebf.js"),["assets/todos.slice.86815ebf.js","assets/slice.10e6ddb0.js","assets/any.07715dce.js"]).then(n=>n.createTodosSlice("todos")),{name:"todos"}),Ye=C(n=>E(()=>import("./todos.http.b28b1df6.js"),["assets/todos.http.b28b1df6.js","assets/env.service.06de621a.js"]).then(t=>t.createTodosHttpApi(n)),{deps:[Ge]}),ee=C((n,t)=>E(()=>import("./todos.data.33186d26.js"),[]).then(e=>e.todosData(n.createResource,t)),{deps:[te,Ye]}),tn=C((n,t)=>({getHoveringState:()=>t.getState().hoveringState,getTasks:()=>n.getState().data,setDraggingTaskId:t.setDraggingTaskId,setHoveringState:t.setHoveringState,updateTask:n.updateTask}),{deps:[ee,gt]}),en=C((n,t)=>E(()=>import("./todos.service.b0614987.js"),[]).then(e=>e.todosService(n,t)),{deps:[tn,Xt]}),nn=Ee(n=>E(()=>import("./todos.subscription.dec6bdce.js"),[]).then(t=>t.initiateFetch(n)),{deps:[ee]}),rn=gt.selector,mt=n=>{var t,e,r;return(r=(e=(t=n.data)==null?void 0:t.todos)==null?void 0:e.data)!=null?r:[]},on=D(mt,He),sn=D(mt,Ve),an=D(mt,je),cn=D([on,sn,an],Be),un=D([rn,cn],ze),ln=K(()=>E(()=>import("./todos.view.834d59ba.js"),["assets/todos.view.834d59ba.js","assets/repeat.651517fd.js","assets/classes.1cc075b4.js","assets/icon.126990a0.js","assets/todos.view.bd9da7ed.css"]).then(n=>n.todosView),{actions:en,data:un,root:"todos"});dn();async function dn(){const n=document.getElementById("root");if(!n)throw"#root element does not exist";ye({root:n,slices:[Qe,Gt,nt,vt,_t,gt],subscriptions:[nn],views:[Ne,Me,Ae,Ue,ln]})}export{ue as A,w as b,qe as c,$e as g,ie as r,X as s,H as x,hn as y,fn as z};
