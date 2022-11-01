import{y as r,A as g}from"./index.a4500d8b.js";import{c as s}from"./classes.1cc075b4.js";const l="_background_1890f_1",i="_on_1890f_26",e={background:l,switch:"_switch_1890f_15",on:i};function u({content:t,isOn:o,label:n,toggle:c}){return r`
    <button
      class=${e.background}
      type="button"
      role="switch"
      aria-label=${n}
      aria-checked=${o}
      @click=${c}
    >
      <span class=${s(e.switch,o&&e.on)}></span>
      ${t}
    </button>
  `}function _(t){return function(o,n){const{toggle:c}=n,{isDark:a}=o;g(r`
        ${u({isOn:a,label:"Toggle dark mode",toggle:c})}
      `,t)}}export{_ as createDarkModeView};
