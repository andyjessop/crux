import{A as w,y as l}from"./lit-html.9b9017eb.js";import{o as h}from"./map.a4f06f37.js";import{n as s,e as a}from"./ref.7a167248.js";import"./directive.9b57a945.js";function P(d,g,f){const{email:t,password:i,formState:o}=g,{close:$,onChange:u,onSubmit:c}=f;if(t==null||i===void 0)return null;const r=a(),m=a(),p=a();w(S(),d);function b(n){var e,v;n.preventDefault(),c({email:(e=m.value)==null?void 0:e.value,password:(v=p.value)==null?void 0:v.value})}r.value.addEventListener("sl-request-close",n=>{$()});function S(){var n;return l`
    <sl-dialog
      ${s(r)}
      label="Dialog"
      class="dialog-focus"
      open>
      <form @submit=${b}>
        <sl-input
          ${s(m)}
          type="text"
          name="${t.name}"
          @input=${e=>u({field:t.name,value:e.target.value})}
          .value="${t.value}"></sl-input>
        ${t.errors.length&&!t.isPristine?l`${h(t.errors,e=>l`<div>${e}</div>`)}`:null}
        <sl-input
          ${s(p)}
          type="password"
          name="${i.name}"
          @input=${e=>u({field:i.name,value:e.target.value})}
          .value="${i.value}"></sl-input>
        ${((n=i.messages)==null?void 0:n.length)&&!i.isPristine?l`<div>${i.messages}</div>`:null}
        <sl-button
          .disabled=${o==="submitting"}
          type="submit">
          ${o==="submitting"?"Signing up...":"Sign up"}
        </sl-button>
      </form>
    </sl-dialog>
    `}}export{P as createSignupFormView};
