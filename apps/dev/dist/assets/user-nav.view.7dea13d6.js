import{A as s,y as i}from"./lit-html.9b9017eb.js";function g(n,o,c){const{user:t}=o,{clickLogin:e,clickSignup:l}=c;s(u(),n);function u(){return t?i`<div>Logged in as ${t.email}</div>`:i`
        <sl-button @click=${e}>Log in</sl-button>
        <sl-button @click=${l}>Sign up</sl-button>
      `}}export{g as createUserNavView};
