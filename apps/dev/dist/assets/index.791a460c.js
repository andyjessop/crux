(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();const ur="modulepreload",dr=function(t){return"/"+t},de={},R=function(e,r,o){return!r||r.length===0?e():Promise.all(r.map(i=>{if(i=dr(i),i in de)return;de[i]=!0;const s=i.endsWith(".css"),n=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${n}`))return;const a=document.createElement("link");if(a.rel=s?"stylesheet":ur,s||(a.as="script",a.crossOrigin=""),a.href=i,document.head.appendChild(a),s)return new Promise((l,d)=>{a.addEventListener("load",l),a.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${i}`)))})})).then(()=>e())};function hr(){const t=[];let e=!1;return{add:r,clear:o,entries:t,flush:i};function r(s,...n){let a=()=>{},l=()=>{};const d=new Promise((p,h)=>{l=p,a=h});return t.push({fn:s,params:n,reject:a,resolve:l}),d}function o(){e=!1,t.length=0}async function i(){if(e)return;const s=t[0];if(!!s){e=!0;try{const n=await s.fn(...s.params);return s.resolve(n),t.shift(),e=!1,i()}catch(n){s.reject(n)}}}}function pr(){const t=[];return{emit:o,on:e,onAll:r,once:n,off:i,offAll:s};function e(a,l){const d={handler:l,type:a};return t.push(d),()=>i(a,l)}function r(a){const l={handler:a,type:"all"};t.push(l)}function o(a,l){let d;const p=[];for(d of t){if(d.type!==a&&d.type!=="all")continue;const h=d.handler(l);h!=null&&h.then&&p.push(h)}return Promise.all(p)}function i(a,l){const d=t.findIndex(p=>a===p.type&&l===p.handler);d!==-1&&t.splice(d,1)}function s(a){const l=t.findIndex(d=>d.type==="all"&&a===d.handler);l!==-1&&t.splice(l,1)}function n(a,l){const d={handler:(...p)=>{i(a,l),l(...p)},type:a};t.push(d)}}const fr=()=>(t,e,r)=>{let o;const i=Object.keys(r),s=i.reduce((b,m)=>(b[m]=p(m),b),{}),n=br(s),a=i.reduce((b,m)=>{const f=function(w){return{payload:w,type:s[m]}};return f.type=s[m],b[m]=f,b},{}),l=Object.entries(a).reduce((b,[m,f])=>(b[m]=async function(w){if(!o)throw`${t} slice middleware has not yet been registered with the store. Dispatch is not available.`;const P=f(w);o(f(w)),b.emit(m,P.payload)},b),{...pr()});return{actions:a,api:l,middleware:b=>(o||(o=b.dispatch),m=>f=>{if(m(f),y(f.type)){const w=b.getState()[t],P=n[f.type],z=r[P](w,f.payload);h(z)||z({api:l})}}),reducer:(b,m)=>{const[f]=m.type.split("/"),w=b||e;if(y(m.type)){const P=n[m.type];if(f!==t||!r[P])return b!=null?b:e;const z=r[P](w,m.payload);return h(z)?z:w}return w}};function p(b){return`${t}/${b}`}function h(b){return typeof b!="function"}function y(b){return n[b]!==void 0}};function br(t){const e={};for(const r in t)e[t[r]]=r;return e}function vr(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function he(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),r.push.apply(r,o)}return r}function pe(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?he(Object(r),!0).forEach(function(o){vr(t,o,r[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):he(Object(r)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(r,o))})}return t}function N(t){return"Minified Redux error #"+t+"; visit https://redux.js.org/Errors?code="+t+" for the full message or use the non-minified dev environment for full errors. "}var fe=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}(),It=function(){return Math.random().toString(36).substring(7).split("").join(".")},Tt={INIT:"@@redux/INIT"+It(),REPLACE:"@@redux/REPLACE"+It(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+It()}};function mr(t){if(typeof t!="object"||t===null)return!1;for(var e=t;Object.getPrototypeOf(e)!==null;)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(t)===e}function Ie(t,e,r){var o;if(typeof e=="function"&&typeof r=="function"||typeof r=="function"&&typeof arguments[3]=="function")throw new Error(N(0));if(typeof e=="function"&&typeof r>"u"&&(r=e,e=void 0),typeof r<"u"){if(typeof r!="function")throw new Error(N(1));return r(Ie)(t,e)}if(typeof t!="function")throw new Error(N(2));var i=t,s=e,n=[],a=n,l=!1;function d(){a===n&&(a=n.slice())}function p(){if(l)throw new Error(N(3));return s}function h(f){if(typeof f!="function")throw new Error(N(4));if(l)throw new Error(N(5));var w=!0;return d(),a.push(f),function(){if(!!w){if(l)throw new Error(N(6));w=!1,d();var z=a.indexOf(f);a.splice(z,1),n=null}}}function y(f){if(!mr(f))throw new Error(N(7));if(typeof f.type>"u")throw new Error(N(8));if(l)throw new Error(N(9));try{l=!0,s=i(s,f)}finally{l=!1}for(var w=n=a,P=0;P<w.length;P++){var z=w[P];z()}return f}function b(f){if(typeof f!="function")throw new Error(N(10));i=f,y({type:Tt.REPLACE})}function m(){var f,w=h;return f={subscribe:function(z){if(typeof z!="object"||z===null)throw new Error(N(11));function X(){z.next&&z.next(p())}X();var Ut=w(X);return{unsubscribe:Ut}}},f[fe]=function(){return this},f}return y({type:Tt.INIT}),o={dispatch:y,subscribe:h,getState:p,replaceReducer:b},o[fe]=m,o}var gr=Ie;function yr(t){Object.keys(t).forEach(function(e){var r=t[e],o=r(void 0,{type:Tt.INIT});if(typeof o>"u")throw new Error(N(12));if(typeof r(void 0,{type:Tt.PROBE_UNKNOWN_ACTION()})>"u")throw new Error(N(13))})}function be(t){for(var e=Object.keys(t),r={},o=0;o<e.length;o++){var i=e[o];typeof t[i]=="function"&&(r[i]=t[i])}var s=Object.keys(r),n;try{yr(r)}catch(a){n=a}return function(l,d){if(l===void 0&&(l={}),n)throw n;for(var p=!1,h={},y=0;y<s.length;y++){var b=s[y],m=r[b],f=l[b],w=m(f,d);if(typeof w>"u")throw d&&d.type,new Error(N(14));h[b]=w,p=p||w!==f}return p=p||s.length!==Object.keys(l).length,p?h:l}}function ie(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return e.length===0?function(o){return o}:e.length===1?e[0]:e.reduce(function(o,i){return function(){return o(i.apply(void 0,arguments))}})}function _r(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(o){return function(){var i=o.apply(void 0,arguments),s=function(){throw new Error(N(15))},n={getState:i.getState,dispatch:function(){return s.apply(void 0,arguments)}},a=e.map(function(l){return l(n)});return s=ie.apply(void 0,a)(i.dispatch),pe(pe({},i),{},{dispatch:s})}}}const wr=()=>{const t=[];return{middleware:({getState:e,dispatch:r})=>o=>i=>{const s={getState:e,dispatch:a=>r(a)},n=t.map(a=>a(s));return ie(...n)(o)(i)},add:(e,r)=>(r===void 0?t.push(e):t.splice(r,0,e),()=>{const o=t.findIndex(i=>i===e);o<0||t.splice(o,1)}),getIndex:e=>t.findIndex(r=>r===e)}},$r=()=>{const t=new Map;let e=o=>o||{};return{add:r,reducer:(o,i)=>e(o,i)};function r(o,i){return t.set(o,i),e=be(Object.fromEntries(t)),function(){t.delete(o),e=be(Object.fromEntries(t))}}};function xr({isDev:t}={isDev:!0}){const e=wr(),r=$r(),o=e.add,i=r.add,s=_r(e.middleware),n=t&&typeof window<"u"&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||ie,a=gr(r.reducer,{},n(s));return{addMiddleware:o,addReducer:i,store:a}}function kr(...t){if(t.length===1)return t[0];const e=new Set;for(const r of t)for(const o of r)t.every(i=>i.has(o))&&e.add(o);return e}function ve(t,e){const r=kr(t,e),o=new Set;for(const i of t)r.has(i)||o.add(i);return o}function Ar(t){return Object.prototype.toString.call(t)==="[object Object]"}function Ve(t,e){const r={...t};for(const[o,i]of Object.entries(e))Array.isArray(i)?r[o]=[...i]:Ar(i)?r[o]={...Ve(r[o],e[o])}:r[o]=i;return r}function Er(){let t,e;return{promise:new Promise((r,o)=>{t=r,e=o}),reject:e,resolve:t}}function Cr(t,e){const r={...t,...Object.entries(e).reduce((n,[a,l])=>{l.deps||(l.deps=[]);const d=l.deps,p=[];return d.forEach(h=>{const y=h.split(".");if(y.length>1){const[b,m]=y;p.unshift(`module-${b}.${m}`),p.unshift(`module-${h.split(".")[0]}`)}else p.push(h)}),l.deps=p,n[`module-${a}`]=l,n},{})},o={};return{get:i,getModule:s};async function i(n,a){var m;if(o[n])return o[n];const{promise:l,resolve:d}=Er();o[n]=l;const p=n.split(".");if(p.length>1){const f=await o[p[0]];f.services&&Object.entries(f.services).forEach(([w,P])=>{r[`${p[0]}.${w}`]=P})}const h=[];for(const f of r[n].deps||[]){const w=f.split(".");w.length>1&&await i(w[0],a);const P=(m=o[f])!=null?m:await i(f,a);f.startsWith("module-")&&f.split(".").length<2||h.push(P)}const b=(await r[n].factory())(...h);return n.startsWith("module-")&&(a==null||a(n.slice(7),o[n])),b.services&&Object.entries(b.services).forEach(([f,w])=>{r[`${n}.${f}`]=w}),d(b),o[n]}async function s(n,a){return await i(`module-${n}`,a)}}async function Sr(t,{logger:e}={}){const{addMiddleware:r,addReducer:o,store:i}=xr(),s={dispatch:i.dispatch,getState:i.getState},{layout:n,modules:a,root:l,services:d}=t,p=Cr(d,a),h=new Map,y={...n.view,currentData:null},b=ar(),m=new Map,f=new Set,w=hr(),P={};let z=!0;const{actions:X,reducer:Ut}=fr()("__crux",{regions:[]},{initReducer:(_,L)=>_,initSlice:(_,L)=>_,setRegions:(_,L)=>Ve(_,{regions:[...L]})});return o("__cruxCore",Ut),r(rr),await er(i.dispatch),z=!1,i.dispatch({type:"__crux/ready",payload:void 0}),{addMiddleware:r,addReducer:o,services:p,store:i};async function er(_){const L=await b.factory(),{middleware:O,reducer:T}=L(s);ue("layout",_,{middleware:O,reducer:T}),_(X.initReducer("layout")),y.render=await y.factory()}function rr(_){return function(O){return async function(x){if(x.type===X.initReducer.type||x.type===X.setRegions.type||x.type===X.initSlice.type){e==null||e.log("info",JSON.stringify({message:"Is core action. Passing to reducers.",data:x})),O(x);return}if(z){e==null||e.log("info",JSON.stringify({message:"Crux is busy. Adding action to queue.",data:x})),w.add(_.dispatch,x);return}e==null||e.log("info",JSON.stringify({message:"Crux is not busy. Passing to reducers",data:x})),O(x);const E=await or(_.getState(),_.dispatch);E!=null&&E.length&&(e==null||e.log("info",JSON.stringify({message:"New modules",data:E})));const k=await ir(_.getState());k&&(e==null||e.log("info",JSON.stringify({message:"New regions",data:k})),_.dispatch(X.setRegions(k))),await sr(_.getState()),e==null||e.log("info",JSON.stringify({message:"Flushing queue",data:w.entries.map(M=>M.fn.name)})),w.flush()}}}function ue(_,L,O){let T,x;const{actions:E,create:k,destroy:M,middleware:S,reducer:D,views:H={}}=O;E&&(P[_]=Object.entries(E).reduce((j,[Z,gt])=>(j[Z]=yt=>L(gt(yt)),j),{})),S&&(x=r(S)),D&&(T=o(_,D));for(const[j,Z]of Object.entries(H))h.set(j,lr(Z));return L(X.initSlice(_)),k==null||k(s),O.unregister=()=>{E&&delete P[_];for(const j of Object.keys(H))h.delete(j);M==null||M(s),x==null||x(),T==null||T()},O}async function or(_,L){const O=[],T=[];Object.entries(a).forEach(([E,k])=>{var M,S;if(((M=k.enabled)==null?void 0:M.call(k,_))===!1&&f.has(E))return O.push(E);if((!k.enabled||((S=k.enabled)==null?void 0:S.call(k,_))===!0)&&!f.has(E))return T.push(E)});const x=[];for(const E of O)x.push(p.getModule(E,async(k,M)=>{var S,D;return(D=(S=await M).unregister)==null?void 0:D.call(S)})),f.delete(E);for(const E of T)x.push(p.getModule(E,async(k,M)=>ue(k,L,await M))),f.add(E);return await Promise.all(x),T}async function ir(_){const{currentData:L,render:O,selectData:T}=y,x=T==null?void 0:T(_);return x===L?void 0:(y.currentData=x,await(O==null?void 0:O(l,x)),Array.from(document.querySelectorAll("[data-crux-root]")).filter(k=>k!==null).map(k=>k.getAttribute("data-crux-root")))}async function sr(_){var M;const L=nr(_),O=new Set(L),T=new Set(m.keys()),x=ve(T,O);for(const S of x){const D=m.get(S);!D||((M=D.destroy)==null||M.call(D),m.delete(S))}const E=ve(O,T);for(const S of E){const D=cr(h,"root",S);if(!D){e==null||e.log("debug",JSON.stringify({message:`No view found for root ${S}`}));continue}const H={...D},j=L.find(Z=>Z===S);H.rootEl=document.querySelector(`[data-crux-root=${j}`),H.render=await D.factory(),m.set(S,{...H})}const k=[...m.values()];for(let S=0;S<k.length;S++){const{currentData:D,render:H,root:j,rootEl:Z,selectActions:gt,selectData:yt}=k[S],Pt=yt==null?void 0:yt(_);e==null||e.log("debug",JSON.stringify({message:`Current state for view ${j}`,data:JSON.stringify(Pt)})),!(Pt===D||Z===void 0)&&(k[S].currentData=Pt,await(H==null?void 0:H(Z,Pt,gt==null?void 0:gt(P))))}}function nr(_){return _.__cruxCore.regions}function ar(){return{...n.module}}function lr(_){return{..._,currentActions:null,currentData:null}}function cr(_,L,O){for(const[T,x]of _.entries())if(x[L]===O)return x}}const Pr=({auth:t,layout:e})=>({auth:t,layout:e});var Be=Object.defineProperty,Or=Object.defineProperties,Tr=Object.getOwnPropertyDescriptor,Lr=Object.getOwnPropertyDescriptors,me=Object.getOwnPropertySymbols,zr=Object.prototype.hasOwnProperty,Dr=Object.prototype.propertyIsEnumerable,ge=(t,e,r)=>e in t?Be(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,at=(t,e)=>{for(var r in e||(e={}))zr.call(e,r)&&ge(t,r,e[r]);if(me)for(var r of me(e))Dr.call(e,r)&&ge(t,r,e[r]);return t},Rt=(t,e)=>Or(t,Lr(e)),c=(t,e,r,o)=>{for(var i=o>1?void 0:o?Tr(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Be(e,r,i),i};function it(t,e,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=t.animate(e,Rt(at({},r),{duration:Rr()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function Rr(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function dt(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{const o=requestAnimationFrame(r);e.addEventListener("cancel",()=>o,{once:!0}),e.addEventListener("finish",()=>o,{once:!0}),e.cancel()})))}var He=new Map,Nr=new WeakMap;function Mr(t){return t!=null?t:{keyframes:[],options:{duration:0}}}function ye(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function lt(t,e){He.set(t,Mr(e))}function st(t,e,r){const o=Nr.get(t);if(o!=null&&o[e])return ye(o[e],r.dir);const i=He.get(e);return i?ye(i,r.dir):{keyframes:[],options:{duration:0}}}var Nt=class{constructor(t,...e){this.slotNames=[],(this.host=t).addController(this),this.slotNames=e,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(t){const e=t.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()}},G={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},se=t=>(...e)=>({_$litDirective$:t,values:e}),ne=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ae=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,le=Symbol(),_e=new Map,je=class{constructor(t,e){if(this._$cssResult$=!0,e!==le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=_e.get(this.cssText);return ae&&t===void 0&&(_e.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}},Fr=t=>new je(typeof t=="string"?t:t+"",le),W=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new je(r,le)},Ur=(t,e)=>{ae?t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):e.forEach(r=>{const o=document.createElement("style"),i=window.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)})},we=ae?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Fr(r)})(t):t,Vt,$e=window.trustedTypes,Ir=$e?$e.emptyScript:"",xe=window.reactiveElementPolyfillSupport,At={toAttribute(t,e){switch(e){case Boolean:t=t?Ir:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},qe=(t,e)=>e!==t&&(e==e||t==t),Bt={attribute:!0,type:String,converter:At,reflect:!1,hasChanged:qe},ut=class extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;(e=this.l)!==null&&e!==void 0||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,r)=>{const o=this._$Eh(r,e);o!==void 0&&(this._$Eu.set(o,r),t.push(o))}),t}static createProperty(t,e=Bt){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const r=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,r,e);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){return{get(){return this[e]},set(o){const i=this[t];this[e]=o,this.requestUpdate(t,i,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Bt}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const e=this.properties,r=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const o of r)this.createProperty(o,e[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const o of r)e.unshift(we(o))}else t!==void 0&&e.push(we(t));return e}static _$Eh(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Em(),this.requestUpdate(),(t=this.constructor.l)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,r;((e=this._$Eg)!==null&&e!==void 0?e:this._$Eg=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)===null||r===void 0||r.call(t))}removeController(t){var e;(e=this._$Eg)===null||e===void 0||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Ur(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var r;return(r=e.hostConnected)===null||r===void 0?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var r;return(r=e.hostDisconnected)===null||r===void 0?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ES(t,e,r=Bt){var o,i;const s=this.constructor._$Eh(t,r);if(s!==void 0&&r.reflect===!0){const n=((i=(o=r.converter)===null||o===void 0?void 0:o.toAttribute)!==null&&i!==void 0?i:At.toAttribute)(e,r.type);this._$Ei=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Ei=null}}_$AK(t,e){var r,o,i;const s=this.constructor,n=s._$Eu.get(t);if(n!==void 0&&this._$Ei!==n){const a=s.getPropertyOptions(n),l=a.converter,d=(i=(o=(r=l)===null||r===void 0?void 0:r.fromAttribute)!==null&&o!==void 0?o:typeof l=="function"?l:null)!==null&&i!==void 0?i:At.fromAttribute;this._$Ei=n,this[n]=d(e,a.type),this._$Ei=null}}requestUpdate(t,e,r){let o=!0;t!==void 0&&(((r=r||this.constructor.getPropertyOptions(t)).hasChanged||qe)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Ei!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,r))):o=!1),!this.isUpdatePending&&o&&(this._$Ep=this._$E_())}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach((o,i)=>this[i]=o),this._$Et=void 0);let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$Eg)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(r)):this._$EU()}catch(o){throw e=!1,this._$EU(),o}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$Eg)===null||e===void 0||e.forEach(r=>{var o;return(o=r.hostUpdated)===null||o===void 0?void 0:o.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,r)=>this._$ES(r,this[r],e)),this._$EC=void 0),this._$EU()}updated(t){}firstUpdated(t){}};ut.finalized=!0,ut.elementProperties=new Map,ut.elementStyles=[],ut.shadowRootOptions={mode:"open"},xe==null||xe({ReactiveElement:ut}),((Vt=globalThis.reactiveElementVersions)!==null&&Vt!==void 0?Vt:globalThis.reactiveElementVersions=[]).push("1.3.2");var Ht,ft=globalThis.trustedTypes,ke=ft?ft.createPolicy("lit-html",{createHTML:t=>t}):void 0,Q=`lit$${(Math.random()+"").slice(9)}$`,Ke="?"+Q,Vr=`<${Ke}>`,bt=document,Et=(t="")=>bt.createComment(t),Ct=t=>t===null||typeof t!="object"&&typeof t!="function",We=Array.isArray,Br=t=>{var e;return We(t)||typeof((e=t)===null||e===void 0?void 0:e[Symbol.iterator])=="function"},_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Ee=/>/g,ot=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,Ce=/'/g,Se=/"/g,Je=/^(?:script|style|textarea|title)$/i,Hr=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),U=Hr(1),V=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),Pe=new WeakMap,jr=(t,e,r)=>{var o,i;const s=(o=r==null?void 0:r.renderBefore)!==null&&o!==void 0?o:e;let n=s._$litPart$;if(n===void 0){const a=(i=r==null?void 0:r.renderBefore)!==null&&i!==void 0?i:null;s._$litPart$=n=new Mt(e.insertBefore(Et(),a),a,void 0,r!=null?r:{})}return n._$AI(t),n},pt=bt.createTreeWalker(bt,129,null,!1),qr=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":"",n=_t;for(let l=0;l<r;l++){const d=t[l];let p,h,y=-1,b=0;for(;b<d.length&&(n.lastIndex=b,h=n.exec(d),h!==null);)b=n.lastIndex,n===_t?h[1]==="!--"?n=Ae:h[1]!==void 0?n=Ee:h[2]!==void 0?(Je.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=ot):h[3]!==void 0&&(n=ot):n===ot?h[0]===">"?(n=i!=null?i:_t,y=-1):h[1]===void 0?y=-2:(y=n.lastIndex-h[2].length,p=h[1],n=h[3]===void 0?ot:h[3]==='"'?Se:Ce):n===Se||n===Ce?n=ot:n===Ae||n===Ee?n=_t:(n=ot,i=void 0);const m=n===ot&&t[l+1].startsWith("/>")?" ":"";s+=n===_t?d+Vr:y>=0?(o.push(p),d.slice(0,y)+"$lit$"+d.slice(y)+Q+m):d+Q+(y===-2?(o.push(void 0),l):m)}const a=s+(t[r]||"<?>")+(e===2?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[ke!==void 0?ke.createHTML(a):a,o]},Lt=class{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let i=0,s=0;const n=t.length-1,a=this.parts,[l,d]=qr(t,e);if(this.el=Lt.createElement(l,r),pt.currentNode=this.el.content,e===2){const p=this.el.content,h=p.firstChild;h.remove(),p.append(...h.childNodes)}for(;(o=pt.nextNode())!==null&&a.length<n;){if(o.nodeType===1){if(o.hasAttributes()){const p=[];for(const h of o.getAttributeNames())if(h.endsWith("$lit$")||h.startsWith(Q)){const y=d[s++];if(p.push(h),y!==void 0){const b=o.getAttribute(y.toLowerCase()+"$lit$").split(Q),m=/([.?@])?(.*)/.exec(y);a.push({type:1,index:i,name:m[2],strings:b,ctor:m[1]==="."?Wr:m[1]==="?"?Xr:m[1]==="@"?Yr:Ft})}else a.push({type:6,index:i})}for(const h of p)o.removeAttribute(h)}if(Je.test(o.tagName)){const p=o.textContent.split(Q),h=p.length-1;if(h>0){o.textContent=ft?ft.emptyScript:"";for(let y=0;y<h;y++)o.append(p[y],Et()),pt.nextNode(),a.push({type:2,index:++i});o.append(p[h],Et())}}}else if(o.nodeType===8)if(o.data===Ke)a.push({type:2,index:i});else{let p=-1;for(;(p=o.data.indexOf(Q,p+1))!==-1;)a.push({type:7,index:i}),p+=Q.length-1}i++}}static createElement(t,e){const r=bt.createElement("template");return r.innerHTML=t,r}};function vt(t,e,r=t,o){var i,s,n,a;if(e===V)return e;let l=o!==void 0?(i=r._$Cl)===null||i===void 0?void 0:i[o]:r._$Cu;const d=Ct(e)?void 0:e._$litDirective$;return(l==null?void 0:l.constructor)!==d&&((s=l==null?void 0:l._$AO)===null||s===void 0||s.call(l,!1),d===void 0?l=void 0:(l=new d(t),l._$AT(t,r,o)),o!==void 0?((n=(a=r)._$Cl)!==null&&n!==void 0?n:a._$Cl=[])[o]=l:r._$Cu=l),l!==void 0&&(e=vt(t,l._$AS(t,e.values),l,o)),e}var Kr=class{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:r},parts:o}=this._$AD,i=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:bt).importNode(r,!0);pt.currentNode=i;let s=pt.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Mt(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new Zr(s,this,t)),this.v.push(d),l=o[++a]}n!==(l==null?void 0:l.index)&&(s=pt.nextNode(),n++)}return i}m(t){let e=0;for(const r of this.v)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},Mt=class{constructor(t,e,r,o){var i;this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cg=(i=o==null?void 0:o.isConnected)===null||i===void 0||i}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=vt(this,t,e),Ct(t)?t===C||t==null||t===""?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==V&&this.$(t):t._$litType$!==void 0?this.T(t):t.nodeType!==void 0?this.k(t):Br(t)?this.S(t):this.$(t)}M(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==C&&Ct(this._$AH)?this._$AA.nextSibling.data=t:this.k(bt.createTextNode(t)),this._$AH=t}T(t){var e;const{values:r,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Lt.createElement(o.h,this.options)),o);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===i)this._$AH.m(r);else{const s=new Kr(i,this),n=s.p(this.options);s.m(r),this.k(n),this._$AH=s}}_$AC(t){let e=Pe.get(t.strings);return e===void 0&&Pe.set(t.strings,e=new Lt(t)),e}S(t){We(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const i of t)o===e.length?e.push(r=new Mt(this.M(Et()),this.M(Et()),this,this.options)):r=e[o],r._$AI(i),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,e);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var e;this._$AM===void 0&&(this._$Cg=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}},Ft=class{constructor(t,e,r,o,i){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=C}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,r,o){const i=this.strings;let s=!1;if(i===void 0)t=vt(this,t,e,0),s=!Ct(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const n=t;let a,l;for(t=i[0],a=0;a<i.length-1;a++)l=vt(this,n[r+a],e,a),l===V&&(l=this._$AH[a]),s||(s=!Ct(l)||l!==this._$AH[a]),l===C?t=C:t!==C&&(t+=(l!=null?l:"")+i[a+1]),this._$AH[a]=l}s&&!o&&this.C(t)}C(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},Wr=class extends Ft{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===C?void 0:t}},Jr=ft?ft.emptyScript:"",Xr=class extends Ft{constructor(){super(...arguments),this.type=4}C(t){t&&t!==C?this.element.setAttribute(this.name,Jr):this.element.removeAttribute(this.name)}},Yr=class extends Ft{constructor(t,e,r,o,i){super(t,e,r,o,i),this.type=5}_$AI(t,e=this){var r;if((t=(r=vt(this,t,e,0))!==null&&r!==void 0?r:C)===V)return;const o=this._$AH,i=t===C&&o!==C||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==C&&(o===C||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;typeof this._$AH=="function"?this._$AH.call((r=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&r!==void 0?r:this.element,t):this._$AH.handleEvent(t)}},Zr=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){vt(this,t)}},Oe=window.litHtmlPolyfillSupport;Oe==null||Oe(Lt,Mt),((Ht=globalThis.litHtmlVersions)!==null&&Ht!==void 0?Ht:globalThis.litHtmlVersions=[]).push("2.2.4");var jt,qt,xt=class extends ut{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const r=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=r.firstChild),r}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=jr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!1)}render(){return V}};xt.finalized=!0,xt._$litElement$=!0,(jt=globalThis.litElementHydrateSupport)===null||jt===void 0||jt.call(globalThis,{LitElement:xt});var Te=globalThis.litElementPolyfillSupport;Te==null||Te({LitElement:xt});((qt=globalThis.litElementVersions)!==null&&qt!==void 0?qt:globalThis.litElementVersions=[]).push("3.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var nt=se(class extends ne{constructor(t){var e;if(super(t),t.type!==G.ATTRIBUTE||t.name!=="class"||((e=t.strings)===null||e===void 0?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var r,o;if(this.et===void 0){this.et=new Set,t.strings!==void 0&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in e)e[s]&&!(!((r=this.st)===null||r===void 0)&&r.has(s))&&this.et.add(s);return this.render(e)}const i=t.element.classList;this.et.forEach(s=>{s in e||(i.remove(s),this.et.delete(s))});for(const s in e){const n=!!e[s];n===this.et.has(s)||((o=this.st)===null||o===void 0?void 0:o.has(s))||(n?(i.add(s),this.et.add(s)):(i.remove(s),this.et.delete(s)))}return V}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Yt=new Set,Gr=new MutationObserver(Ze),ht=new Map,Xe=document.documentElement.dir||"ltr",Ye=document.documentElement.lang||navigator.language,kt;Gr.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});function Qr(...t){t.map(e=>{const r=e.$code.toLowerCase();ht.has(r)?ht.set(r,Object.assign(Object.assign({},ht.get(r)),e)):ht.set(r,e),kt||(kt=e)}),Ze()}function Ze(){Xe=document.documentElement.dir||"ltr",Ye=document.documentElement.lang||navigator.language,[...Yt.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var to=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Yt.add(this.host)}hostDisconnected(){Yt.delete(this.host)}dir(){return`${this.host.dir||Xe}`.toLowerCase()}lang(){return`${this.host.lang||Ye}`.toLowerCase()}term(t,...e){const r=this.lang().toLowerCase().slice(0,2),o=this.lang().length>2?this.lang().toLowerCase():"",i=ht.get(o),s=ht.get(r);let n;if(i&&i[t])n=i[t];else if(s&&s[t])n=s[t];else if(kt&&kt[t])n=kt[t];else return console.error(`No translation found for: ${String(t)}`),t;return typeof n=="function"?n(...e):n}date(t,e){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),e).format(t)}number(t,e){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),e).format(t)}relativeTime(t,e,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,e)}},St=class extends to{},eo={$code:"en",$name:"English",$dir:"ltr",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",hidePassword:"Hide password",loading:"Loading",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",toggleColorFormat:"Toggle color format"};Qr(eo);var tt=W`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`,ro=W`
  ${tt}

  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-top-width: calc(var(--sl-panel-border-width) * 3);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--box-shadow);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
    margin: inherit;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--primary {
    border-top-color: var(--sl-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--sl-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--sl-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--sl-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--sl-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-end: var(--sl-spacing-medium);
  }
`;function B(t,e){const r=at({waitUntilFirstUpdate:!1},e);return(o,i)=>{const{update:s}=o;if(t in o){const n=t;o.update=function(a){if(a.has(n)){const l=a.get(n),d=this[n];l!==d&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](l,d)}s.call(this,a)}}}}function $(t,e,r){const o=new CustomEvent(e,at({bubbles:!0,cancelable:!1,composed:!0,detail:{}},r));return t.dispatchEvent(o),o}function zt(t,e){return new Promise(r=>{function o(i){i.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}var et=t=>e=>typeof e=="function"?((r,o)=>(window.customElements.define(r,o),o))(t,e):((r,o)=>{const{kind:i,elements:s}=o;return{kind:i,elements:s,finisher(n){window.customElements.define(r,n)}}})(t,e),oo=(t,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?Rt(at({},e),{finisher(r){r.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(r){r.createProperty(e.key,t)}};function u(t){return(e,r)=>r!==void 0?((o,i,s)=>{i.constructor.createProperty(s,o)})(t,e,r):oo(t,e)}function mt(t){return u(Rt(at({},t),{state:!0}))}var io=({finisher:t,descriptor:e})=>(r,o)=>{var i;if(o===void 0){const s=(i=r.originalKey)!==null&&i!==void 0?i:r.key,n=e!=null?{kind:"method",placement:"prototype",key:s,descriptor:e(r.key)}:Rt(at({},r),{key:s});return t!=null&&(n.finisher=function(a){t(a,s)}),n}{const s=r.constructor;e!==void 0&&Object.defineProperty(r,o,e(o)),t==null||t(s,o)}};function rt(t,e){return io({descriptor:r=>{const o={get(){var i,s;return(s=(i=this.renderRoot)===null||i===void 0?void 0:i.querySelector(t))!==null&&s!==void 0?s:null},enumerable:!0,configurable:!0};if(e){const i=typeof r=="symbol"?Symbol():"__"+r;o.get=function(){var s,n;return this[i]===void 0&&(this[i]=(n=(s=this.renderRoot)===null||s===void 0?void 0:s.querySelector(t))!==null&&n!==void 0?n:null),this[i]}}return o}})}var Kt;((Kt=window.HTMLSlotElement)===null||Kt===void 0?void 0:Kt.prototype.assignedElements)!=null;var J=class extends xt{};c([u()],J.prototype,"dir",2);c([u()],J.prototype,"lang",2);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ct=Object.assign(document.createElement("div"),{className:"sl-toast-stack"}),q=class extends J{constructor(){super(...arguments),this.hasSlotController=new Nt(this,"icon","suffix"),this.localize=new St(this),this.open=!1,this.closable=!1,this.variant="primary",this.duration=1/0}firstUpdated(){this.base.hidden=!this.open}async show(){if(!this.open)return this.open=!0,zt(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,zt(this,"sl-after-hide")}async toast(){return new Promise(t=>{ct.parentElement===null&&document.body.append(ct),ct.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener("sl-after-hide",()=>{ct.removeChild(this),t(),ct.querySelector("sl-alert")===null&&ct.remove()},{once:!0})})}restartAutoHide(){clearTimeout(this.autoHideTimeout),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration))}handleCloseClick(){this.hide()}handleMouseMove(){this.restartAutoHide()}async handleOpenChange(){if(this.open){$(this,"sl-show"),this.duration<1/0&&this.restartAutoHide(),await dt(this.base),this.base.hidden=!1;const{keyframes:t,options:e}=st(this,"alert.show",{dir:this.localize.dir()});await it(this.base,t,e),$(this,"sl-after-show")}else{$(this,"sl-hide"),clearTimeout(this.autoHideTimeout),await dt(this.base);const{keyframes:t,options:e}=st(this,"alert.hide",{dir:this.localize.dir()});await it(this.base,t,e),this.base.hidden=!0,$(this,"sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}render(){return U`
      <div
        part="base"
        class=${nt({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":this.variant==="primary","alert--success":this.variant==="success","alert--neutral":this.variant==="neutral","alert--warning":this.variant==="warning","alert--danger":this.variant==="danger"})}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden=${this.open?"false":"true"}
        @mousemove=${this.handleMouseMove}
      >
        <span part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </span>

        <span part="message" class="alert__message">
          <slot></slot>
        </span>

        ${this.closable?U`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x"
                library="system"
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:""}
      </div>
    `}};q.styles=ro;c([rt('[part="base"]')],q.prototype,"base",2);c([u({type:Boolean,reflect:!0})],q.prototype,"open",2);c([u({type:Boolean,reflect:!0})],q.prototype,"closable",2);c([u({reflect:!0})],q.prototype,"variant",2);c([u({type:Number})],q.prototype,"duration",2);c([B("open",{waitUntilFirstUpdate:!0})],q.prototype,"handleOpenChange",1);c([B("duration")],q.prototype,"handleDurationChange",1);q=c([et("sl-alert")],q);lt("alert.show",{keyframes:[{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1)"}],options:{duration:250,easing:"ease"}});lt("alert.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.8)"}],options:{duration:250,easing:"ease"}});var so=W`
  ${tt}

  :host {
    display: inline-block;
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-medium) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`,Ge=Symbol.for(""),no=t=>{var e,r;if(((e=t)===null||e===void 0?void 0:e.r)===Ge)return(r=t)===null||r===void 0?void 0:r._$litStatic$},Dt=(t,...e)=>({_$litStatic$:e.reduce((r,o,i)=>r+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[i+1],t[0]),r:Ge}),Le=new Map,ao=t=>(e,...r)=>{const o=r.length;let i,s;const n=[],a=[];let l,d=0,p=!1;for(;d<o;){for(l=e[d];d<o&&(s=r[d],(i=no(s))!==void 0);)l+=i+e[++d],p=!0;a.push(s),n.push(l),d++}if(d===o&&n.push(e[o]),p){const h=n.join("$$lit$$");(e=Le.get(h))===void 0&&(n.raw=n,Le.set(h,e=n)),r=a}return t(e,...r)},Ot=ao(U);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var v=t=>t!=null?t:C;/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var I=class extends J{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}handleBlur(){this.hasFocus=!1,$(this,"sl-blur")}handleFocus(){this.hasFocus=!0,$(this,"sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}render(){const t=!!this.href,e=t?Dt`a`:Dt`button`;return Ot`
      <${e}
        part="base"
        class=${nt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${v(t?void 0:this.disabled)}
        type=${v(t?void 0:"button")}
        href=${v(t?this.href:void 0)}
        target=${v(t?this.target:void 0)}
        download=${v(t?this.download:void 0)}
        rel=${v(t&&this.target?"noreferrer noopener":void 0)}
        role=${v(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${v(this.name)}
          library=${v(this.library)}
          src=${v(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};I.styles=so;c([mt()],I.prototype,"hasFocus",2);c([rt(".icon-button")],I.prototype,"button",2);c([u()],I.prototype,"name",2);c([u()],I.prototype,"library",2);c([u()],I.prototype,"src",2);c([u()],I.prototype,"href",2);c([u()],I.prototype,"target",2);c([u()],I.prototype,"download",2);c([u()],I.prototype,"label",2);c([u({type:Boolean,reflect:!0})],I.prototype,"disabled",2);I=c([et("sl-icon-button")],I);var lo=W`
  ${tt}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    contain: strict;
    box-sizing: content-box !important;
  }

  .icon,
  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`,Zt="";function Gt(t){Zt=t}function co(){if(!Zt){const t=[...document.getElementsByTagName("script")],e=t.find(r=>r.hasAttribute("data-shoelace"));if(e)Gt(e.getAttribute("data-shoelace"));else{const r=t.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src));let o="";r&&(o=r.getAttribute("src")),Gt(o.split("/").slice(0,-1).join("/"))}}return Zt.replace(/\/$/,"")}var uo={name:"default",resolver:t=>`${co()}/assets/icons/${t}.svg`},ho=uo,ze={"check-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,x:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},po={name:"system",resolver:t=>t in ze?`data:image/svg+xml,${encodeURIComponent(ze[t])}`:""},fo=po,bo=[ho,fo],Qt=[];function vo(t){Qt.push(t)}function mo(t){Qt=Qt.filter(e=>e!==t)}function De(t){return bo.find(e=>e.name===t)}var Wt=new Map;function go(t,e="cors"){if(Wt.has(t))return Wt.get(t);const r=fetch(t,{mode:e}).then(async o=>({ok:o.ok,status:o.status,html:await o.text()}));return Wt.set(t,r),r}var Jt=new Map;async function yo(t){if(Jt.has(t))return Jt.get(t);const e=await go(t),r={ok:e.ok,status:e.status,svg:null};if(e.ok){const o=document.createElement("div");o.innerHTML=e.html;const i=o.firstElementChild;r.svg=(i==null?void 0:i.tagName.toLowerCase())==="svg"?i.outerHTML:""}return Jt.set(t,r),r}var te=class extends ne{constructor(t){if(super(t),this.it=C,t.type!==G.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===C||t==null)return this.ft=void 0,this.it=t;if(t===V)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this.ft;this.it=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}};te.directiveName="unsafeHTML",te.resultType=1;var ee=class extends te{};ee.directiveName="unsafeSVG",ee.resultType=2;var _o=se(ee),Xt,Y=class extends J{constructor(){super(...arguments),this.svg="",this.label="",this.library="default"}connectedCallback(){super.connectedCallback(),vo(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),mo(this)}getUrl(){const t=De(this.library);return this.name&&t?t.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){var t;const e=De(this.library),r=this.getUrl();if(Xt||(Xt=new DOMParser),r)try{const o=await yo(r);if(r!==this.getUrl())return;if(o.ok){const s=Xt.parseFromString(o.svg,"text/html").body.querySelector("svg");s!==null?((t=e==null?void 0:e.mutator)==null||t.call(e,s),this.svg=s.outerHTML,$(this,"sl-load")):(this.svg="",$(this,"sl-error"))}else this.svg="",$(this,"sl-error")}catch{$(this,"sl-error")}else this.svg.length>0&&(this.svg="")}handleChange(){this.setIcon()}render(){const t=typeof this.label=="string"&&this.label.length>0;return U` <div
      part="base"
      class="icon"
      role=${v(t?"img":void 0)}
      aria-label=${v(t?this.label:void 0)}
      aria-hidden=${v(t?void 0:"true")}
    >
      ${_o(this.svg)}
    </div>`}};Y.styles=lo;c([mt()],Y.prototype,"svg",2);c([u({reflect:!0})],Y.prototype,"name",2);c([u()],Y.prototype,"src",2);c([u()],Y.prototype,"label",2);c([u({reflect:!0})],Y.prototype,"library",2);c([B("name"),B("src"),B("library")],Y.prototype,"setIcon",1);Y=c([et("sl-icon")],Y);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var wo=W`
  ${tt}

  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition: var(--sl-transition-x-fast) background-color, var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border, var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label ::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-300);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-color-neutral-300);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    font-size: var(--sl-button-font-size-small);
    height: var(--sl-input-height-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    font-size: var(--sl-button-font-size-medium);
    height: var(--sl-input-height-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    font-size: var(--sl-button-font-size-large);
    height: var(--sl-input-height-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    display: flex;
    align-items: center;
  }

  .button--caret .button__caret svg {
    width: 1em;
    height: 1em;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%) translateX(50%);
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    transform: translateY(-50%) translateX(-50%);
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host(.sl-button-group__button--first:not(.sl-button-group__button--last)) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host(.sl-button-group__button--inner) .button {
    border-radius: 0;
  }

  :host(.sl-button-group__button--last:not(.sl-button-group__button--first)) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host(.sl-button-group__button:not(.sl-button-group__button--first)) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(.sl-button-group__button:not(.sl-button-group__button--focus, .sl-button-group__button--first, .sl-button-group__button--radio, [variant='default']):not(:hover, :active, :focus))
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host(.sl-button-group__button--hover) {
    z-index: 1;
  }

  :host(.sl-button-group__button--focus),
  :host(.sl-button-group__button[checked]) {
    z-index: 2;
  }
`,$o=class extends Event{constructor(t){super("formdata"),this.formData=t}},xo=class extends FormData{constructor(t){var e=(...r)=>{super(...r)};t?(e(t),this.form=t,t.dispatchEvent(new $o(this))):e()}append(t,e){if(!this.form)return super.append(t,e);let r=this.form.elements[t];if(r||(r=document.createElement("input"),r.type="hidden",r.name=t,this.form.appendChild(r)),this.has(t)){const o=this.getAll(t),i=o.indexOf(r.value);i!==-1&&o.splice(i,1),o.push(e),this.set(t,o)}else super.append(t,e);r.value=e}};function ko(){const t=document.createElement("form");let e=!1;return document.body.append(t),t.addEventListener("submit",r=>{new FormData(r.target),r.preventDefault()}),t.addEventListener("formdata",()=>e=!0),t.dispatchEvent(new Event("submit",{cancelable:!0})),t.remove(),e}function Re(){!window.FormData||ko()||(window.FormData=xo,window.addEventListener("submit",t=>{t.defaultPrevented||new FormData(t.target)}))}document.readyState==="complete"?Re():window.addEventListener("DOMContentLoaded",()=>Re());var wt=new WeakMap,ce=class{constructor(t,e){(this.host=t).addController(this),this.options=at({form:r=>r.closest("form"),name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>r.disabled,reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,setValue:(r,o)=>{r.value=o}},e),this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this),this.handleFormReset=this.handleFormReset.bind(this),this.reportFormValidity=this.reportFormValidity.bind(this)}hostConnected(){this.form=this.options.form(this.host),this.form&&(this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),wt.has(this.form)||(wt.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()))}hostDisconnected(){this.form&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),wt.has(this.form)&&(this.form.reportValidity=wt.get(this.form),wt.delete(this.form)),this.form=void 0)}handleFormData(t){const e=this.options.disabled(this.host),r=this.options.name(this.host),o=this.options.value(this.host);!e&&typeof r=="string"&&typeof o<"u"&&(Array.isArray(o)?o.forEach(i=>{t.formData.append(r,i.toString())}):t.formData.append(r,o.toString()))}handleFormSubmit(t){const e=this.options.disabled(this.host),r=this.options.reportValidity;this.form&&!this.form.noValidate&&!e&&!r(this.host)&&(t.preventDefault(),t.stopImmediatePropagation())}handleFormReset(){this.options.setValue(this.host,this.options.defaultValue(this.host))}reportFormValidity(){if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if(typeof e.reportValidity=="function"&&!e.reportValidity())return!1}return!0}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&["formaction","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))}),this.form.append(r),r.click(),r.remove()}}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}},A=class extends J{constructor(){super(...arguments),this.formSubmitController=new ce(this,{form:t=>{if(t.hasAttribute("form")){const e=t.getRootNode(),r=t.getAttribute("form");return e.getElementById(r)}return t.closest("form")}}),this.hasSlotController=new Nt(this,"[default]","prefix","suffix"),this.localize=new St(this),this.hasFocus=!1,this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button"}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}handleBlur(){this.hasFocus=!1,$(this,"sl-blur")}handleFocus(){this.hasFocus=!0,$(this,"sl-focus")}handleClick(t){if(this.disabled||this.loading){t.preventDefault(),t.stopPropagation();return}this.type==="submit"&&this.formSubmitController.submit(this),this.type==="reset"&&this.formSubmitController.reset(this)}render(){const t=!!this.href,e=t?Dt`a`:Dt`button`;return Ot`
      <${e}
        part="base"
        class=${nt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${v(t?void 0:this.disabled)}
        type=${v(t?void 0:this.type)}
        name=${v(t?void 0:this.name)}
        value=${v(t?void 0:this.value)}
        href=${v(t?this.href:void 0)}
        target=${v(t?this.target:void 0)}
        download=${v(t?this.download:void 0)}
        rel=${v(t&&this.target?"noreferrer noopener":void 0)}
        role=${v(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <span part="prefix" class="button__prefix">
          <slot name="prefix"></slot>
        </span>
        <span part="label" class="button__label">
          <slot></slot>
        </span>
        <span part="suffix" class="button__suffix">
          <slot name="suffix"></slot>
        </span>
        ${this.caret?Ot`
                <span part="caret" class="button__caret">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              `:""}
        ${this.loading?Ot`<sl-spinner></sl-spinner>`:""}
      </${e}>
    `}};A.styles=wo;c([rt(".button")],A.prototype,"button",2);c([mt()],A.prototype,"hasFocus",2);c([u({reflect:!0})],A.prototype,"variant",2);c([u({reflect:!0})],A.prototype,"size",2);c([u({type:Boolean,reflect:!0})],A.prototype,"caret",2);c([u({type:Boolean,reflect:!0})],A.prototype,"disabled",2);c([u({type:Boolean,reflect:!0})],A.prototype,"loading",2);c([u({type:Boolean,reflect:!0})],A.prototype,"outline",2);c([u({type:Boolean,reflect:!0})],A.prototype,"pill",2);c([u({type:Boolean,reflect:!0})],A.prototype,"circle",2);c([u()],A.prototype,"type",2);c([u()],A.prototype,"name",2);c([u()],A.prototype,"value",2);c([u()],A.prototype,"href",2);c([u()],A.prototype,"target",2);c([u()],A.prototype,"download",2);c([u()],A.prototype,"form",2);c([u({attribute:"formaction"})],A.prototype,"formAction",2);c([u({attribute:"formmethod"})],A.prototype,"formMethod",2);c([u({attribute:"formnovalidate",type:Boolean})],A.prototype,"formNoValidate",2);c([u({attribute:"formtarget"})],A.prototype,"formTarget",2);A=c([et("sl-button")],A);var Ao=W`
  ${tt}

  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
    mix-blend-mode: multiply;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.01em, 2.75em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.01em, 2.75em;
    }
  }
`,re=class extends J{constructor(){super(...arguments),this.localize=new St(this)}render(){return U`
      <svg part="base" class="spinner" role="progressbar" aria-valuetext=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};re.styles=Ao;re=c([et("sl-spinner")],re);var Eo=W`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control_label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
  }

  .form-control--has-help-text .form-control__help-text ::slotted(*) {
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }
`,Co=W`
  ${tt}
  ${Eo}

  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    padding-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    padding-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    padding-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    padding-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    padding-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    padding-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  .input--empty .input__clear {
    visibility: hidden;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide Firefox's clear button on date and time inputs */
  .input--is-firefox input[type='date'],
  .input--is-firefox input[type='time'] {
    clip-path: inset(0 2em 0 0);
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`,So=t=>t.strings===void 0,Po={},Oo=(t,e=Po)=>t._$AH=e,Qe=se(class extends ne{constructor(t){if(super(t),t.type!==G.PROPERTY&&t.type!==G.ATTRIBUTE&&t.type!==G.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!So(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===V||e===C)return e;const r=t.element,o=t.name;if(t.type===G.PROPERTY){if(e===r[o])return V}else if(t.type===G.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return V}else if(t.type===G.ATTRIBUTE&&r.getAttribute(o)===e+"")return V;return Oo(t),e}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var tr=(t="value")=>(e,r)=>{const o=e.constructor,i=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(s,n,a){var l;const d=o.getPropertyOptions(t),p=typeof d.attribute=="string"?d.attribute:t;if(s===p){const h=d.converter||At,b=(typeof h=="function"?h:(l=h==null?void 0:h.fromAttribute)!=null?l:At.fromAttribute)(a,d.type);this[t]!==b&&(this[r]=b)}i.call(this,s,n,a)}},Ne,To=(Ne=navigator.userAgentData)==null?void 0:Ne.brands.some(t=>t.brand.includes("Chromium")),Lo=To?!1:navigator.userAgent.includes("Firefox"),g=class extends J{constructor(){super(...arguments),this.formSubmitController=new ce(this),this.hasSlotController=new Nt(this,"help-text","label"),this.localize=new St(this),this.hasFocus=!1,this.isPasswordVisible=!1,this.type="text",this.size="medium",this.value="",this.defaultValue="",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.togglePassword=!1,this.noSpinButtons=!1,this.disabled=!1,this.readonly=!1,this.required=!1,this.invalid=!1}get valueAsDate(){var t,e;return(e=(t=this.input)==null?void 0:t.valueAsDate)!=null?e:null}set valueAsDate(t){const e=document.createElement("input");e.type="date",e.valueAsDate=t,this.value=e.value}get valueAsNumber(){var t,e;return(e=(t=this.input)==null?void 0:t.valueAsNumber)!=null?e:parseFloat(this.value)}set valueAsNumber(t){const e=document.createElement("input");e.type="number",e.valueAsNumber=t,this.value=e.value}firstUpdated(){this.invalid=!this.input.checkValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,r="none"){this.input.setSelectionRange(t,e,r)}setRangeText(t,e,r,o="preserve"){this.input.setRangeText(t,e,r,o),this.value!==this.input.value&&(this.value=this.input.value,$(this,"sl-input"),$(this,"sl-change"))}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,$(this,"sl-blur")}handleChange(){this.value=this.input.value,$(this,"sl-change")}handleClearClick(t){this.value="",$(this,"sl-clear"),$(this,"sl-input"),$(this,"sl-change"),this.input.focus(),t.stopPropagation()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleStepChange(){this.input.step=String(this.step),this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,$(this,"sl-focus")}handleInput(){this.value=this.input.value,$(this,"sl-input")}handleInvalid(){this.invalid=!0}handleKeyDown(t){const e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{t.defaultPrevented||this.formSubmitController.submit()})}handlePasswordToggle(){this.isPasswordVisible=!this.isPasswordVisible}handleValueChange(){this.invalid=!this.input.checkValidity()}render(){const t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),r=this.label?!0:!!t,o=this.helpText?!0:!!e,i=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return U`
      <div
        part="form-control"
        class=${nt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":r,"form-control--has-help-text":o})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${r?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${nt({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--invalid":this.invalid,"input--no-spin-buttons":this.noSpinButtons,"input--is-firefox":Lo})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.isPasswordVisible?"text":this.type}
              name=${v(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${v(this.placeholder)}
              minlength=${v(this.minlength)}
              maxlength=${v(this.maxlength)}
              min=${v(this.min)}
              max=${v(this.max)}
              step=${v(this.step)}
              .value=${Qe(this.value)}
              autocapitalize=${v(this.type==="password"?"off":this.autocapitalize)}
              autocomplete=${v(this.type==="password"?"off":this.autocomplete)}
              autocorrect=${v(this.type==="password"?"off":this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${v(this.spellcheck)}
              pattern=${v(this.pattern)}
              enterkeyhint=${v(this.enterkeyhint)}
              inputmode=${v(this.inputmode)}
              aria-describedby="help-text"
              aria-invalid=${this.invalid?"true":"false"}
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${i?U`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:""}
            ${this.togglePassword&&!this.disabled?U`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.isPasswordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.isPasswordVisible?U`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:U`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};g.styles=Co;c([rt(".input__control")],g.prototype,"input",2);c([mt()],g.prototype,"hasFocus",2);c([mt()],g.prototype,"isPasswordVisible",2);c([u({reflect:!0})],g.prototype,"type",2);c([u({reflect:!0})],g.prototype,"size",2);c([u()],g.prototype,"name",2);c([u()],g.prototype,"value",2);c([tr()],g.prototype,"defaultValue",2);c([u({type:Boolean,reflect:!0})],g.prototype,"filled",2);c([u({type:Boolean,reflect:!0})],g.prototype,"pill",2);c([u()],g.prototype,"label",2);c([u({attribute:"help-text"})],g.prototype,"helpText",2);c([u({type:Boolean})],g.prototype,"clearable",2);c([u({attribute:"toggle-password",type:Boolean})],g.prototype,"togglePassword",2);c([u({attribute:"no-spin-buttons",type:Boolean})],g.prototype,"noSpinButtons",2);c([u()],g.prototype,"placeholder",2);c([u({type:Boolean,reflect:!0})],g.prototype,"disabled",2);c([u({type:Boolean,reflect:!0})],g.prototype,"readonly",2);c([u({type:Number})],g.prototype,"minlength",2);c([u({type:Number})],g.prototype,"maxlength",2);c([u()],g.prototype,"min",2);c([u()],g.prototype,"max",2);c([u()],g.prototype,"step",2);c([u()],g.prototype,"pattern",2);c([u({type:Boolean,reflect:!0})],g.prototype,"required",2);c([u({type:Boolean,reflect:!0})],g.prototype,"invalid",2);c([u()],g.prototype,"autocapitalize",2);c([u()],g.prototype,"autocorrect",2);c([u()],g.prototype,"autocomplete",2);c([u({type:Boolean})],g.prototype,"autofocus",2);c([u()],g.prototype,"enterkeyhint",2);c([u({type:Boolean})],g.prototype,"spellcheck",2);c([u()],g.prototype,"inputmode",2);c([B("disabled",{waitUntilFirstUpdate:!0})],g.prototype,"handleDisabledChange",1);c([B("step",{waitUntilFirstUpdate:!0})],g.prototype,"handleStepChange",1);c([B("value",{waitUntilFirstUpdate:!0})],g.prototype,"handleValueChange",1);g=c([et("sl-input")],g);function Me(t){const e=t.tagName.toLowerCase();return t.getAttribute("tabindex")==="-1"||t.hasAttribute("disabled")||t.hasAttribute("aria-disabled")&&t.getAttribute("aria-disabled")!=="false"||e==="input"&&t.getAttribute("type")==="radio"&&!t.hasAttribute("checked")||t.offsetParent===null||window.getComputedStyle(t).visibility==="hidden"?!1:(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"?!0:["button","input","select","textarea","a","audio","video","summary"].includes(e)}function zo(t){var e,r;const o=[];function i(a){a instanceof HTMLElement&&(o.push(a),a.shadowRoot!==null&&a.shadowRoot.mode==="open"&&i(a.shadowRoot)),[...a.children].forEach(l=>i(l))}i(t);const s=(e=o.find(a=>Me(a)))!=null?e:null,n=(r=o.reverse().find(a=>Me(a)))!=null?r:null;return{start:s,end:n}}var $t=[],Do=class{constructor(t){this.tabDirection="forward",this.element=t,this.handleFocusIn=this.handleFocusIn.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this)}activate(){$t.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){$t=$t.filter(t=>t!==this.element),document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return $t[$t.length-1]===this.element}checkFocus(){if(this.isActive()&&!this.element.matches(":focus-within")){const{start:t,end:e}=zo(this.element),r=this.tabDirection==="forward"?t:e;typeof(r==null?void 0:r.focus)=="function"&&r.focus({preventScroll:!0})}}handleFocusIn(){this.checkFocus()}handleKeyDown(t){t.key==="Tab"&&t.shiftKey&&(this.tabDirection="backward"),requestAnimationFrame(()=>this.checkFocus())}handleKeyUp(){this.tabDirection="forward"}},oe=new Set;function Fe(t){oe.add(t),document.body.classList.add("sl-scroll-lock")}function Ue(t){oe.delete(t),oe.size===0&&document.body.classList.remove("sl-scroll-lock")}var Ro=W`
  ${tt}

  :host {
    --width: 31rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--sl-z-index-dialog);
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--sl-spacing-2x-large));
    max-height: calc(100% - var(--sl-spacing-2x-large));
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
    transform: none;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
  }

  .dialog__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .dialog__close {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-x-large);
    padding: 0 var(--header-spacing);
  }

  .dialog__body {
    flex: 1 1 auto;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(sl-button:not(:first-of-type)) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
  }
`,K=class extends J{constructor(){super(...arguments),this.hasSlotController=new Nt(this,"footer"),this.localize=new St(this),this.open=!1,this.label="",this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.modal=new Do(this)}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.modal.activate(),Fe(this))}disconnectedCallback(){super.disconnectedCallback(),Ue(this)}async show(){if(!this.open)return this.open=!0,zt(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,zt(this,"sl-after-hide")}requestClose(t){if($(this,"sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const r=st(this,"dialog.denyClose",{dir:this.localize.dir()});it(this.panel,r.keyframes,r.options);return}this.hide()}handleKeyDown(t){t.key==="Escape"&&(t.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){$(this,"sl-show"),this.originalTrigger=document.activeElement,this.modal.activate(),Fe(this);const t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([dt(this.dialog),dt(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{$(this,"sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});const e=st(this,"dialog.show",{dir:this.localize.dir()}),r=st(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([it(this.panel,e.keyframes,e.options),it(this.overlay,r.keyframes,r.options)]),$(this,"sl-after-show")}else{$(this,"sl-hide"),this.modal.deactivate(),await Promise.all([dt(this.dialog),dt(this.overlay)]);const t=st(this,"dialog.hide",{dir:this.localize.dir()}),e=st(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([it(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),it(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,Ue(this);const r=this.originalTrigger;typeof(r==null?void 0:r.focus)=="function"&&setTimeout(()=>r.focus()),$(this,"sl-after-hide")}}render(){return U`
      <div
        part="base"
        class=${nt({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${v(this.noHeader?this.label:void 0)}
          aria-labelledby=${v(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":U`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <sl-icon-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="dialog__close"
                    name="x"
                    label=${this.localize.term("close")}
                    library="system"
                    @click="${()=>this.requestClose("close-button")}"
                  ></sl-icon-button>
                </header>
              `}

          <div part="body" class="dialog__body">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};K.styles=Ro;c([rt(".dialog")],K.prototype,"dialog",2);c([rt(".dialog__panel")],K.prototype,"panel",2);c([rt(".dialog__overlay")],K.prototype,"overlay",2);c([u({type:Boolean,reflect:!0})],K.prototype,"open",2);c([u({reflect:!0})],K.prototype,"label",2);c([u({attribute:"no-header",type:Boolean,reflect:!0})],K.prototype,"noHeader",2);c([B("open",{waitUntilFirstUpdate:!0})],K.prototype,"handleOpenChange",1);K=c([et("sl-dialog")],K);lt("dialog.show",{keyframes:[{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1)"}],options:{duration:250,easing:"ease"}});lt("dialog.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.8)"}],options:{duration:250,easing:"ease"}});lt("dialog.denyClose",{keyframes:[{transform:"scale(1)"},{transform:"scale(1.02)"},{transform:"scale(1)"}],options:{duration:250}});lt("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});lt("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});var No=W`
  ${tt}

  :host {
    --height: var(--sl-toggle-size);
    --thumb-size: calc(var(--sl-toggle-size) + 4px);
    --width: calc(var(--height) * 2);

    display: inline-block;
  }

  .switch {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-font-size-medium);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--sl-color-neutral-400);
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    border-radius: var(--height);
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: 50%;
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    transform: translateX(calc((var(--width) - var(--height)) / -2));
    transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color, var(--sl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-400);
  }

  /* Focus */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    transform: translateX(calc((var(--width) - var(--height)) / 2));
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch__label {
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
  }

  :host([required]) .switch__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`,F=class extends J{constructor(){super(...arguments),this.formSubmitController=new ce(this,{value:t=>t.checked?t.value:void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasFocus=!1,this.disabled=!1,this.required=!1,this.checked=!1,this.invalid=!1,this.defaultChecked=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,$(this,"sl-blur")}handleCheckedChange(){this.input.checked=this.checked,this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,$(this,"sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,$(this,"sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,$(this,"sl-change")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,$(this,"sl-change"))}render(){return U`
      <label
        part="base"
        class=${nt({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus})}
      >
        <input
          class="switch__input"
          type="checkbox"
          name=${v(this.name)}
          value=${v(this.value)}
          .checked=${Qe(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <span part="label" class="switch__label">
          <slot></slot>
        </span>
      </label>
    `}};F.styles=No;c([rt('input[type="checkbox"]')],F.prototype,"input",2);c([mt()],F.prototype,"hasFocus",2);c([u()],F.prototype,"name",2);c([u()],F.prototype,"value",2);c([u({type:Boolean,reflect:!0})],F.prototype,"disabled",2);c([u({type:Boolean,reflect:!0})],F.prototype,"required",2);c([u({type:Boolean,reflect:!0})],F.prototype,"checked",2);c([u({type:Boolean,reflect:!0})],F.prototype,"invalid",2);c([tr("checked")],F.prototype,"defaultChecked",2);c([B("checked",{waitUntilFirstUpdate:!0})],F.prototype,"handleCheckedChange",1);c([B("disabled",{waitUntilFirstUpdate:!0})],F.prototype,"handleDisabledChange",1);F=c([et("sl-switch")],F);Gt("/path/to/shoelace/dist");Mo();async function Mo(){const t=document.getElementById("root");if(!t)throw"No root found!!";const{services:e}=await Sr({modules:{auth:{deps:["authApi"],factory:()=>R(()=>import("./auth.module.e78024b7.js"),["assets/auth.module.e78024b7.js","assets/machine.26234c57.js"]).then(r=>r.createAuthModule)},darkMode:{deps:["cache"],factory:()=>R(()=>import("./dark-mode.module.ce5f9b6e.js"),[]).then(r=>r.createDarkModeModule)},data:{deps:["usersApi"],factory:()=>R(()=>import("./data.module.3b4232a0.js"),["assets/data.module.3b4232a0.js","assets/machine.26234c57.js"]).then(r=>r.createDataModule)},router:{deps:["cache"],factory:()=>R(()=>import("./router.module.31ea6156.js"),[]).then(r=>r.createRouterModule)},signupForm:{deps:["auth.api"],factory:()=>R(()=>import("./sign-up-form.module.ab20a2ce.js"),[]).then(r=>r.createSignupFormModule)},toast:{deps:[],factory:()=>R(()=>import("./toaster.module.65d21cf2.js"),[]).then(r=>r.createToastModule)},users:{deps:["data.users"],factory:()=>R(()=>import("./user.module.ff8d3fe7.js"),[]).then(r=>r.createUserModule)}},layout:{module:{factory:()=>R(()=>import("./layout.module.7e34acc0.js"),[]).then(r=>r.createLayoutModule)},view:{selectData:Pr,factory:()=>R(()=>import("./layout.view.e57d8e3d.js"),["assets/layout.view.e57d8e3d.js","assets/layout.view.156c63d8.css","assets/lit-html.9b9017eb.js"]).then(r=>r.createLayoutView)}},root:t,services:{asyncCache:{factory:()=>R(()=>import("./async-cache.service.eafbb6c5.js"),[]).then(r=>r.createAsyncCacheService)},authApi:{factory:()=>R(()=>import("./api.86e3c4b7.js"),["assets/api.86e3c4b7.js","assets/env.service.e4b665b8.js"]).then(r=>r.createAuthApi),deps:["asyncCache","env"]},cache:{factory:()=>R(()=>import("./cache.service.a5a72e72.js"),[]).then(r=>r.createCacheService)},env:{factory:()=>R(()=>import("./env.service.e4b665b8.js"),[]).then(r=>r.env)},featureFlags:{factory:()=>R(()=>import("./feature-flags.service.acbfde49.js"),[]).then(r=>r.createFeatureFlagsService)},reporting:{factory:()=>R(()=>import("./logging.service.d183d238.js"),[]).then(r=>r.createReportingService)},usersApi:{factory:()=>R(()=>import("./users-api.service.7d765f0a.js"),[]).then(r=>r.createUsersApiService)}}});window.services=e}export{R as _,pr as a,hr as b,fr as c,Ve as m};
