import{A as c,y as o}from"./index.9b704175.js";const e="_app_1t6k2_1",n="_column_1t6k2_10",d="_production_1t6k2_15",l="_staging_1t6k2_19",_="_preview_1t6k2_23",v="_sidebar_1t6k2_27",p="_top_1t6k2_31",u="_left_1t6k2_40",g="_right_1t6k2_40",$="_releases_1t6k2_44",k="_controls_1t6k2_48",t={app:e,column:n,production:d,staging:l,preview:_,sidebar:v,top:p,left:u,right:g,releases:$,controls:k};function x(r,s){c(i(s.layout.roots),r);function i(a){return o`
      <div class=${t.app}>
        <div class=${t.top}>
          <div class=${t.left} data-crux-root="top-left"></div>
            ${s.auth.machineState==="signupForm"?o`<div class=${t.right} data-crux-root="sign-up-form"></div>`:null}
            <div class=${t.right} data-crux-root="user-nav"></div>
          </div>
          
          <div class=${t.controls} data-crux-root="controls"></div>
          <div class=${t.production} data-crux-root="production"></div>
          <div class=${t.staging} data-crux-root="staging"></div>
          <div class=${t.preview} data-crux-root="preview"></div>
          <div class=${t.releases} data-crux-root="releases"></div>
          ${a.sidebar?o`<div class=${t.sidebar} data-crux-root="sidebar"></div>`:null}
        </div>
      </div>
    `}}export{x as createLayoutView};
