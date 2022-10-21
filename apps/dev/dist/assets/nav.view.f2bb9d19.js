import{A as s,y as n}from"./lit-html.c1443299.js";import{c as f}from"./repeat.8b84cb03.js";function $(e){return function(o,r){const{items:a}=o,{navigate:c}=r;s(i(a),e);function i(l){const u=f(l,t=>t.route,t=>n`
          <li><a href @click=${m=>c({name:t.route},m)}>${t.text}</a></li>
        `);return n`
        <ul>
          ${u}
          </ul>
      `}}}export{$ as navView};
