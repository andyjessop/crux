import{A as l,y as a}from"./index.a4500d8b.js";import{c as m}from"./repeat.651517fd.js";import{c as u}from"./classes.1cc075b4.js";import{i as _}from"./icon.126990a0.js";const f="_nav_117d5_1",p="_active_117d5_33",n={nav:f,"nav-item":"_nav-item_117d5_9",active:p};function h(c){return function(i,o){const{link:e}=o;l(r(i),c);function r(v){const s=m(v,t=>t.route,t=>a`<li class=${u(n["nav-item"],t.active&&n.active)}>
            <a href="#" @click=${e({name:t.route})}> ${_(t.icon)} ${t.text}</a>
          </li>`);return a`<ul class=${n.nav}>
        ${s}
      </ul>`}}}export{h as navView};
