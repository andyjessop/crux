import{y as r,A as g}from"./lit-html.c1443299.js";import{c as s}from"./classes.1cc075b4.js";const l="_background_1890f_1",i="_on_1890f_26",e={background:l,switch:"_switch_1890f_15",on:i};function u({content:t,isOn:o,label:c,toggle:n}){return r`
    <button
      class=${e.background}
      type="button"
      role="switch"
      aria-label=${c}
      aria-checked=${o}
      @click=${n}>
      <span class=${s(e.switch,o&&e.on)}>
      ${t}
    </button>
  `}function _(t){return function(o,c){const{toggle:n}=c,{isDark:a}=o;g(r`
      ${u({isOn:a,label:"Toggle dark mode",toggle:n})}
    `,t)}}export{_ as createDarkModeView};
