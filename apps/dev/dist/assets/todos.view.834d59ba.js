import{r as b,s as x,y as p,A as V}from"./index.a4500d8b.js";import{c as A}from"./repeat.651517fd.js";import{c as N}from"./classes.1cc075b4.js";import{i as q}from"./icon.126990a0.js";const F="_title_1kyvw_1",G="_completed_1kyvw_20",I={title:F,"to-do":"_to-do_1kyvw_12","in-progress":"_in-progress_1kyvw_16",completed:G};function J(o){const t=Math.round((+new Date-o)/1e3),r=60,s=r*60,e=s*24,i=e*7;let n;return t<30?n="just now":t<r?n=`${t} seconds ago`:t<2*r?n="a minute ago":t<s?n=`${Math.floor(t/r)} minutes ago`:Math.floor(t/s)===1?n="1 hour ago":t<e?n=`${Math.floor(t/s)} hours ago`:t<e*2?n="yesterday":t<i?n=`${Math.floor(t/e)} days ago`:Math.floor(t/i)===1?n="1 week ago":n=`${Math.floor(t/i)} weeks ago`,n}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=o=>t=>typeof t=="function"?((r,s)=>(customElements.define(r,s),s))(o,t):((r,s)=>{const{kind:e,elements:i}=s;return{kind:e,elements:i,finisher(n){customElements.define(r,n)}}})(o,t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Q=(o,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,o)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,o)}};function l(o){return(t,r)=>r!==void 0?((s,e,i)=>{e.constructor.createProperty(i,s)})(o,t,r):Q(o,t)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var L;((L=window.HTMLSlotElement)===null||L===void 0?void 0:L.prototype.assignedElements)!=null;const U=`.in-progress{grid-area:in-progress}.completed{grid-area:completed}.to-do{grid-area:to-do}.column{padding:1rem;height:100%;overflow-y:scroll;user-select:none}.column:hover{background-color:#0000001a}
`;var W=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,H=(o,t,r,s)=>{for(var e=s>1?void 0:s?Z(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&W(t,r,e),e};let O=class extends x{render(){return p`<div class=${N(this.status,"column")}>
      <slot></slot>
    </div>`}};O.styles=[b(U)];H([l({type:String})],O.prototype,"status",2);O=H([B("todos-column")],O);function tt({idAttribute:o,draggingClass:t,dragSelector:r,onDrag:s,onDragMove:e,onDrop:i}){return document.addEventListener("pointerdown",n),()=>{document.removeEventListener("pointerdown",n)};function n(v){var u;const g=(u=v.target)==null?void 0:u.closest(r);if(!g)return;const k=v.clientX,P=v.clientY,h=g.getBoundingClientRect();let S=k-h.left,C=P-h.top;const d=g.cloneNode(!0);d.style.width=`${h.width}px`,d.style.height=`${h.height}px`,d.style.position="absolute",d.style.zIndex="1000",d.style.userSelect="none",d.style.pointerEvents="none",t&&(d.className=t),d.ondragstart=function(){return!1},document.body.append(d),document.addEventListener("pointermove",D),document.addEventListener("pointerup",a),y(k,P),s(g.getAttribute(o),v);function y(c,f){d.style.left=c-S+"px",d.style.top=f-C+"px"}function D(c){const f=c.clientX,_=c.clientY;y(f,_),e==null||e(c)}function a(){document.removeEventListener("pointermove",D),document.removeEventListener("pointerup",a),d.remove(),i(g.getAttribute(o),v)}}}const et=`.todos{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr;grid-template-areas:"to-do in-progress completed";max-width:1000px;padding:1rem 0;margin:0 auto;height:calc(100vh - var(--top-height))}
`;var ot=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,z=(o,t,r,s)=>{for(var e=s>1?void 0:s?rt(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&ot(t,r,e),e};let $=class extends x{constructor(){super(...arguments),this["id-attribute"]="",this["dragging-class"]="dragging",this["drag-selector"]=".task"}_onDrag(o){if(o){const t={detail:{id:o},bubbles:!0,composed:!0};this.dispatchEvent(new CustomEvent("dragTask",t))}}_onDrop(o){if(o){const t={detail:{id:o},bubbles:!0,composed:!0};this.dispatchEvent(new CustomEvent("dropTask",t))}}connectedCallback(){super.connectedCallback(),this.destroyDraggable=tt({idAttribute:this["id-attribute"],draggingClass:this["dragging-class"],dragSelector:this["drag-selector"],onDrag:this._onDrag.bind(this),onDrop:this._onDrop.bind(this)})}disconnectedCallback(){var o;(o=this.destroyDraggable)==null||o.call(this)}render(){return p`<div class="todos">
      <slot></slot>
    </div>`}};$.styles=[b(et)];z([l({type:String})],$.prototype,"id-attribute",2);z([l({type:String})],$.prototype,"dragging-class",2);z([l({type:String})],$.prototype,"drag-selector",2);$=z([B("todos-container")],$);const st=`.dropzone{width:100%;height:100%;position:relative;top:-.625rem}.dropzone:hover{border-top:2px solid var(--todos-drag-separator-color)}
`;var nt=Object.defineProperty,it=Object.getOwnPropertyDescriptor,at=(o,t,r,s)=>{for(var e=s>1?void 0:s?it(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&nt(t,r,e),e};class M extends x{_onEnter(t){this.dispatchEvent(new CustomEvent("status-overlay-enter",{detail:{status:t}}))}_onExit(t){this.dispatchEvent(new CustomEvent("status-overlay-exit",{detail:{status:t}}))}render(){return p`<div
      @mouseenter=${()=>this._onEnter(this.status)}
      @mouseleave=${()=>this._onExit(this.status)}
      class="dropzone"
    ></div>`}}M.styles=[b(st)];at([l({type:String})],M.prototype,"status",2);customElements.define("expanding-dropzone",M);const dt=`.task{box-sizing:border-box;position:relative;border:1px solid white;width:100%;cursor:grab;padding:1rem;margin-bottom:1rem;background-color:var(--color-grey-850);border:none;border-radius:3px}.task.to-do{background-color:var(--color-info-dark)}.task.in-progress{background-color:var(--color-primary-dark)}.task.completed{background-color:var(--color-success-dark)}.task.completed .title{text-decoration:line-through}.dragging{background-color:var(--card-background-faded-color);border:1px dashed var(--card-border-faded-color);user-select:none;position:absolute;z-index:1000;transition:none;pointer-events:none;opacity:.75;border:1px dashed whitesmoke;cursor:grabbing}
`,K=`.card{background-color:var(--card-background-color);border:var(--card-border-width) solid var(--card-border-color);transition:var(--card-transition)}.card.interactive:hover{border-color:var(--card-border-highlight-color)}.card.dragging{background-color:var(--card-background-faded-color);border-color:var(--card-border-faded-color)!important;user-select:none}.card.raised{position:absolute;z-index:1000;transition:none;pointer-events:none;opacity:.75;border:1px dashed whitesmoke;cursor:grabbing}.title{color:var(--card-title-color);font-size:var(--card-title-font-size);font-weight:var(--card-title-font-weight);margin-bottom:var(--card-title-margin-bottom)}.subtitle{color:var(--card-subtitle-color);font-size:var(--card-subtitle-font-size);font-weight:var(--card-subtitle-font-weight)}
`;var lt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,w=(o,t,r,s)=>{for(var e=s>1?void 0:s?ct(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&lt(t,r,e),e};class m extends x{render(){return p`<div
      class=${N(this.className,"task",this.status,this["dragging-task-id"]?"":K.interactive)}
    >
      <div class="title">${this.text}</div>
      <div class="subtitle">${this["created-at"]}</div>
      <slot></slot>
    </div>`}}m.styles=[b(dt),b(K)];w([l({type:String})],m.prototype,"created-at",2);w([l({type:String})],m.prototype,"dragging-task-id",2);w([l({type:String})],m.prototype,"status",2);w([l({type:String})],m.prototype,"task-id",2);w([l({type:String})],m.prototype,"text",2);customElements.define("todo-task",m);const pt=`.overlay-before{width:100%;height:calc(50% + .625rem);position:absolute;top:-.625rem;left:0}.overlay-after{width:100%;height:calc(50% + .375rem);position:absolute;top:50%;left:0}.overlay-after:hover,.overlay-before:hover{cursor:copy}.overlay-after:hover{border-bottom:2px solid var(--todos-drag-separator-color)}.overlay-before:hover{border-top:2px solid var(--todos-drag-separator-color)}
`;var ut=Object.defineProperty,gt=Object.getOwnPropertyDescriptor,X=(o,t,r,s)=>{for(var e=s>1?void 0:s?gt(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&ut(t,r,e),e};class E extends x{_onEnter(t,r){this.dispatchEvent(new CustomEvent("overlay-enter",{detail:{index:t,status:r}}))}_onExit(t,r){this.dispatchEvent(new CustomEvent("overlay-exit",{detail:{index:t,status:r}}))}render(){const t=this.placement==="before"?this.index-.5:this.index+.5;return p`<div
      @mouseenter=${()=>this._onEnter(t,this.status)}
      @mouseleave=${()=>this._onExit(t,this.status)}
      class=${`overlay-${this.placement}`}
    ></div>`}}E.styles=[b(pt)];X([l({type:Number})],E.prototype,"index",2);X([l({type:String})],E.prototype,"status",2);X([l({type:String})],E.prototype,"placement",2);customElements.define("task-overlay",E);function yt(o){return function(r,s){const{draggingTaskId:e,tasks:i}=r,{onDrag:n,onDrop:v,onEnter:g,onExit:k}=s;V(P(i),o);function P(h){return p`
        <todos-container
          @dragTask=${S}
          @dropTask=${C}
          dragging-class="dragging"
          id-attribute="id"
          drag-selector="todo-task"
        >
          ${A(h,a=>a.status,({icon:a,status:u,tasks:c,title:f})=>p`
              <todos-column status=${u}>
                <h3 class=${N(I.title,I[u])}>${q(a)}${f}</h3>
                ${A(c,_=>_.id,({createdAt:_,id:T,status:j,text:R},Y)=>p`
                      <todo-task
                        created-at=${J(_)}
                        dragging-task-id=${e}
                        id=${T}
                        status=${j}
                        task-id=${T}
                        text=${R}
                      >
                        ${e&&e!==T?p`
                              <task-overlay
                                index=${Y}
                                @overlay-enter=${d}
                                @overlay-exit=${y}
                                placement="before"
                                status=${j}
                              ></task-overlay>
                              <task-overlay
                                index=${Y}
                                @overlay-enter=${d}
                                @overlay-exit=${y}
                                placement="after"
                                status=${j}
                              ></task-overlay>
                            `:null}
                      </todo-task>
                    `)}
                ${e?p`<expanding-dropzone
                      @status-overlay-enter=${D}
                      @status-overlay-exit=${y}
                      status=${u}
                    ></expanding-dropzone>`:null}
              </todos-column>
            `)}
        </todos-container>
      `;function S(a){n(a.detail.id)}function C(a){v(a.detail.id)}function d(a){g(a.detail.index,a.detail.status)}function y(){k()}function D(a){var c;const u=(c=h.find(f=>f.status===a.detail.status))==null?void 0:c.tasks.length;u!==void 0&&g(u,a.detail.status)}}}}export{yt as todosView};
