import{r as f,s as _,y as c,A as F}from"./index.8cad4e1f.js";import{c as B}from"./repeat.4291924a.js";import{c as H}from"./classes.1cc075b4.js";const G="_title_1uu13_1",J={title:G};function Q(o){const t=Math.round((+new Date-o)/1e3),r=60,s=r*60,e=s*24,i=e*7;let n;return t<30?n="just now":t<r?n=`${t} seconds ago`:t<2*r?n="a minute ago":t<s?n=`${Math.floor(t/r)} minutes ago`:Math.floor(t/s)===1?n="1 hour ago":t<e?n=`${Math.floor(t/s)} hours ago`:t<e*2?n="yesterday":t<i?n=`${Math.floor(t/e)} days ago`:Math.floor(t/i)===1?n="1 week ago":n=`${Math.floor(t/i)} weeks ago`,n}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=o=>t=>typeof t=="function"?((r,s)=>(customElements.define(r,s),s))(o,t):((r,s)=>{const{kind:e,elements:i}=s;return{kind:e,elements:i,finisher(n){customElements.define(r,n)}}})(o,t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=(o,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,o)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,o)}};function l(o){return(t,r)=>r!==void 0?((s,e,i)=>{e.constructor.createProperty(i,s)})(o,t,r):U(o,t)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var X;((X=window.HTMLSlotElement)===null||X===void 0?void 0:X.prototype.assignedElements)!=null;const W=`.in-progress{grid-area:in-progress}.completed{grid-area:completed}.to-do{grid-area:to-do}.column{padding:1rem;height:100%;overflow-y:scroll;user-select:none}.column:hover{background-color:#0000001a}
`;var Z=Object.defineProperty,tt=Object.getOwnPropertyDescriptor,R=(o,t,r,s)=>{for(var e=s>1?void 0:s?tt(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&Z(t,r,e),e};let S=class extends _{render(){return c`<div class=${H(this.status,"column")}>
      <slot></slot>
    </div>`}};S.styles=[f(W)];R([l({type:String})],S.prototype,"status",2);S=R([K("todos-column")],S);function et({idAttribute:o,draggingClass:t,dragSelector:r,onDrag:s,onDragMove:e,onDrop:i}){return document.addEventListener("pointerdown",n),()=>{document.removeEventListener("pointerdown",n)};function n(g){var b;const u=(b=g.target)==null?void 0:b.closest(r);if(!u)return;const k=g.clientX,P=g.clientY,h=u.getBoundingClientRect();let j=k-h.left,L=P-h.top;const d=u.cloneNode(!0);d.style.width=`${h.width}px`,d.style.height=`${h.height}px`,d.style.position="absolute",d.style.zIndex="1000",d.style.userSelect="none",d.style.pointerEvents="none",t&&(d.className=t),d.ondragstart=function(){return!1},document.body.append(d),document.addEventListener("pointermove",D),document.addEventListener("pointerup",O),y(k,P),s(u.getAttribute(o),g);function y(p,$){d.style.left=p-j+"px",d.style.top=$-L+"px"}function D(p){const $=p.clientX,a=p.clientY;y($,a),e==null||e(p)}function O(){document.removeEventListener("pointermove",D),document.removeEventListener("pointerup",O),d.remove(),i(u.getAttribute(o),g)}}}const ot=`.todos{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr;grid-template-areas:"to-do in-progress completed";max-width:1000px;padding:1rem 0;margin:0 auto;height:calc(100vh - var(--top-height))}
`;var rt=Object.defineProperty,st=Object.getOwnPropertyDescriptor,T=(o,t,r,s)=>{for(var e=s>1?void 0:s?st(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&rt(t,r,e),e};let m=class extends _{constructor(){super(...arguments),this["id-attribute"]="",this["dragging-class"]="dragging",this["drag-selector"]=".task"}_onDrag(o){if(o){const t={detail:{id:o},bubbles:!0,composed:!0};this.dispatchEvent(new CustomEvent("dragTask",t))}}_onDrop(o){if(o){const t={detail:{id:o},bubbles:!0,composed:!0};this.dispatchEvent(new CustomEvent("dropTask",t))}}connectedCallback(){super.connectedCallback(),this.destroyDraggable=et({idAttribute:this["id-attribute"],draggingClass:this["dragging-class"],dragSelector:this["drag-selector"],onDrag:this._onDrag.bind(this),onDrop:this._onDrop.bind(this)})}disconnectedCallback(){var o;(o=this.destroyDraggable)==null||o.call(this)}render(){return c`<div class="todos">
      <slot></slot>
    </div>`}};m.styles=[f(ot)];T([l({type:String})],m.prototype,"id-attribute",2);T([l({type:String})],m.prototype,"dragging-class",2);T([l({type:String})],m.prototype,"drag-selector",2);m=T([K("todos-container")],m);const nt=`.dropzone{width:100%;height:100%;position:relative;top:-.625rem}.dropzone:hover{border-top:2px solid var(--todos-drag-separator-color)}
`;var it=Object.defineProperty,at=Object.getOwnPropertyDescriptor,dt=(o,t,r,s)=>{for(var e=s>1?void 0:s?at(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&it(t,r,e),e};class Y extends _{_onEnter(t){this.dispatchEvent(new CustomEvent("status-overlay-enter",{detail:{status:t}}))}_onExit(t){this.dispatchEvent(new CustomEvent("status-overlay-exit",{detail:{status:t}}))}render(){return c`<div
      @mouseenter=${()=>this._onEnter(this.status)}
      @mouseleave=${()=>this._onExit(this.status)}
      class="dropzone"
    ></div>`}}Y.styles=[f(nt)];dt([l({type:String})],Y.prototype,"status",2);customElements.define("expanding-dropzone",Y);const lt=`.task{box-sizing:border-box;position:relative;border:1px solid white;width:100%;cursor:grab;padding:1rem;margin-bottom:1rem;background-color:var(--color-grey-850);border:none;border-radius:3px}.task.to-do{background-color:var(--color-info-dark)}.task.in-progress{background-color:var(--color-primary-dark)}.task.completed{background-color:var(--color-success-dark)}.task.completed .title{text-decoration:line-through}.dragging{background-color:var(--card-background-faded-color);border:1px dashed var(--card-border-faded-color);user-select:none;position:absolute;z-index:1000;transition:none;pointer-events:none;opacity:.75;border:1px dashed whitesmoke;cursor:grabbing}
`,V=`.card{background-color:var(--card-background-color);border:var(--card-border-width) solid var(--card-border-color);transition:var(--card-transition)}.card.interactive:hover{border-color:var(--card-border-highlight-color)}.card.dragging{background-color:var(--card-background-faded-color);border-color:var(--card-border-faded-color)!important;user-select:none}.card.raised{position:absolute;z-index:1000;transition:none;pointer-events:none;opacity:.75;border:1px dashed whitesmoke;cursor:grabbing}.title{color:var(--card-title-color);font-size:var(--card-title-font-size);font-weight:var(--card-title-font-weight);margin-bottom:var(--card-title-margin-bottom)}.subtitle{color:var(--card-subtitle-color);font-size:var(--card-subtitle-font-size);font-weight:var(--card-subtitle-font-weight)}
`;var ct=Object.defineProperty,pt=Object.getOwnPropertyDescriptor,w=(o,t,r,s)=>{for(var e=s>1?void 0:s?pt(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&ct(t,r,e),e};class v extends _{render(){return c`<div
      class=${H(this.className,"task",this.status,this["dragging-task-id"]?"":V.interactive)}
    >
      <div class="title">${this.text}</div>
      <div class="subtitle">${this["created-at"]}</div>
      <slot></slot>
    </div>`}}v.styles=[f(lt),f(V)];w([l({type:String})],v.prototype,"created-at",2);w([l({type:String})],v.prototype,"dragging-task-id",2);w([l({type:String})],v.prototype,"status",2);w([l({type:String})],v.prototype,"task-id",2);w([l({type:String})],v.prototype,"text",2);customElements.define("todo-task",v);const ut=`.overlay-before{width:100%;height:calc(50% + .625rem);position:absolute;top:-.625rem;left:0}.overlay-after{width:100%;height:calc(50% + .375rem);position:absolute;top:50%;left:0}.overlay-after:hover,.overlay-before:hover{cursor:copy}.overlay-after:hover{border-bottom:2px solid var(--todos-drag-separator-color)}.overlay-before:hover{border-top:2px solid var(--todos-drag-separator-color)}
`;var gt=Object.defineProperty,vt=Object.getOwnPropertyDescriptor,A=(o,t,r,s)=>{for(var e=s>1?void 0:s?vt(t,r):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(e=(s?n(t,r,e):n(e))||e);return s&&e&&gt(t,r,e),e};class E extends _{_onEnter(t,r){this.dispatchEvent(new CustomEvent("overlay-enter",{detail:{index:t,status:r}}))}_onExit(t,r){this.dispatchEvent(new CustomEvent("overlay-exit",{detail:{index:t,status:r}}))}render(){const t=this.placement==="before"?this.index-.5:this.index+.5;return c`<div
      @mouseenter=${()=>this._onEnter(t,this.status)}
      @mouseleave=${()=>this._onExit(t,this.status)}
      class=${`overlay-${this.placement}`}
    ></div>`}}E.styles=[f(ut)];A([l({type:Number})],E.prototype,"index",2);A([l({type:String})],E.prototype,"status",2);A([l({type:String})],E.prototype,"placement",2);customElements.define("task-overlay",E);function yt(o){return function(r,s){const{draggingTaskId:e,tasks:i}=r,{onDrag:n,onDrop:g,onEnter:u,onExit:k}=s;F(P(i),o);function P(h){const{toDo:j,inProgress:L,completed:d}=h,y=[{status:"to-do",tasks:j,title:"To Do"},{status:"in-progress",tasks:L,title:"In Progress"},{status:"completed",tasks:d,title:"Completed"}];return c`
        <todos-container
          @dragTask=${D}
          @dropTask=${O}
          dragging-class="dragging"
          id-attribute="id"
          drag-selector="todo-task"
        >
          ${B(y,a=>a.status,({status:a,tasks:z,title:C})=>c`
              <todos-column status=${a}>
                <h3 class=${J.title}>${C}</h3>
                ${B(z,x=>x.id,({createdAt:x,id:N,status:M,text:q},I)=>c`
                      <todo-task
                        created-at=${Q(x)}
                        dragging-task-id=${e}
                        id=${N}
                        status=${M}
                        task-id=${N}
                        text=${q}
                      >
                        ${e&&e!==N?c`
                              <task-overlay
                                index=${I}
                                @overlay-enter=${b}
                                @overlay-exit=${p}
                                placement="before"
                                status=${M}
                              ></task-overlay>
                              <task-overlay
                                index=${I}
                                @overlay-enter=${b}
                                @overlay-exit=${p}
                                placement="after"
                                status=${M}
                              ></task-overlay>
                            `:null}
                      </todo-task>
                    `)}
                ${e?c`<expanding-dropzone
                      @status-overlay-enter=${$}
                      @status-overlay-exit=${p}
                      status=${a}
                    ></expanding-dropzone>`:null}
              </todos-column>
            `)}
        </todos-container>
      `;function D(a){n(a.detail.id)}function O(a){g(a.detail.id)}function b(a){u(a.detail.index,a.detail.status)}function p(){k()}function $(a){var C;const z=(C=y.find(x=>x.status===a.detail.status))==null?void 0:C.tasks.length;z!==void 0&&u(z,a.detail.status)}}}}export{yt as todosView};
