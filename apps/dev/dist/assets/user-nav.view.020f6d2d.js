import{A as g,y as i}from"./index.9b704175.js";function a(n,o,c){const{user:t}=o,{clickLogin:e,clickSignup:u}=c;g(r(),n);function r(){return t?i`<div>Logged in as ${t.email}</div>`:i`
        <button @click=${e}>Log in</button>
        <button @click=${u}>Sign up</button>
      `}}export{a as createUserNavView};
