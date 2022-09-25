import{A as a,y as n}from"./lit-html.9b9017eb.js";import{e as h,n as d}from"./ref.7a167248.js";import"./directive.9b57a945.js";function g(o,i,c){const{toggle:r}=c,{isDark:t}=i,e=h();a(n`
    <sl-switch ${d(e)} .checked=${t}>${t?"Switch to Light Mode":"Switch to Dark Mode"}</sl-switch>
  `,o),e.value.addEventListener("sl-change",s=>{s.stopImmediatePropagation(),r()})}export{g as createDarkModeView};
