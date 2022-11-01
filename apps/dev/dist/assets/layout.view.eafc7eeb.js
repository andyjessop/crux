import{y as o,A as n}from"./index.a4500d8b.js";const e="_top_gduti_1",c="_logo_gduti_10",v="_nav_gduti_19",l="_main_gduti_27",u="_toaster_gduti_33",t={top:e,logo:c,nav:v,"right-nav":"_right-nav_gduti_23",main:l,toaster:u},_="/assets/logo-transparent-small.a30ec985.png",g="_divider_1kkmb_1",$={divider:g};function m(){return o` <div class=${$.divider}></div> `}function f(a){return function(d){const{todos:r}=d;n(s(),a);function s(){let i;return r&&(i=o`<div class=${t.main} data-crux-root="todos"></div>`),o`
        <div class=${t.top}>
          <div class=${t.logo} data-crux-root="logo">
            <img src=${_} alt="Crux Code" />
          </div>
          ${m()}
          <div class=${t.nav} data-crux-root="nav"></div>
          <div class=${t["right-nav"]}>
            <div data-crux-root="dark-mode-toggle"></div>
          </div>
        </div>
        ${i}
        <div class=${t.toaster} data-crux-root="toaster"></div>
      `}}}export{f as createLayoutView};
