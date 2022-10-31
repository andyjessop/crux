import{y as c,A as u}from"./index.8cad4e1f.js";import{c as v}from"./repeat.4291924a.js";import{c as m}from"./classes.1cc075b4.js";const _="_nav_117d5_1",f="_active_117d5_33",a={nav:_,"nav-item":"_nav-item_117d5_9",active:f},$={mountain:"las la-mountain",stream:"las la-stream",user:"las la-user"};function p(t){return c`<i class="${$[t]}"></i>`}function h(t){return function(i,o){const{link:s}=o;u(e(i),t);function e(r){const l=v(r,n=>n.route,n=>c`<li class=${m(a["nav-item"],n.active&&a.active)}>
            <a href="#" @click=${s({name:n.route})}> ${p(n.icon)} ${n.text}</a>
          </li>`);return c`<ul class=${a.nav}>
        ${l}
      </ul>`}}}export{h as navView};
