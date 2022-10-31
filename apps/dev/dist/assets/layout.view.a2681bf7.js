import{y as o,A as n}from"./index.8cad4e1f.js";const e="_top_1rkiz_1",c="_logo_1rkiz_10",v="_nav_1rkiz_19",l="_main_1rkiz_27",_="_toaster_1rkiz_33",t={top:e,logo:c,nav:v,"right-nav":"_right-nav_1rkiz_23",main:l,toaster:_},u="/assets/logo-code-transparent.bf462779.png",g="_divider_1kkmb_1",$={divider:g};function m(){return o` <div class=${$.divider}></div> `}function f(r){return function(a){const{todos:s}=a;n(d(),r);function d(){let i;return s&&(i=o`<div class=${t.main} data-crux-root="todos"></div>`),o`
        <div class=${t.top}>
          <div class=${t.logo} data-crux-root="logo">
            <img src=${u} alt="Crux Code" />
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
