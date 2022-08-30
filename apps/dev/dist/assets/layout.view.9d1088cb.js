import{A as c,y as o}from"./lit-html.d638b774.js";const e="_app_1t6k2_1",d="_column_1t6k2_10",n="_production_1t6k2_15",l="_staging_1t6k2_19",_="_preview_1t6k2_23",v="_sidebar_1t6k2_27",p="_top_1t6k2_31",u="_left_1t6k2_40",g="_right_1t6k2_40",$="_releases_1t6k2_44",k="_controls_1t6k2_48",t={app:e,column:d,production:n,staging:l,preview:_,sidebar:v,top:p,left:u,right:g,releases:$,controls:k};function m(s,r){c(a(r.roots),s);function a(i){return o`
      <div class=${t.app}>
      <div class=${t.top}>
        <div class=${t.left} data-crux-root="top-left"></div>
          <div class=${t.middle} data-crux-root="top-middle"></div>
          <div class=${t.right} data-crux-root="user-nav"></div>
        </div>
        
        <div class=${t.controls} data-crux-root="controls"></div>
        <div class=${t.production} data-crux-root="production"></div>
        <div class=${t.staging} data-crux-root="staging"></div>
        <div class=${t.preview} data-crux-root="preview"></div>
        <div class=${t.releases} data-crux-root="releases"></div>
        ${i.sidebar?o`<div class=${t.sidebar} data-crux-root="sidebar"></div>`:null}
      </div>
    `}}export{m as createLayoutView};
