declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*' assert {type: 'css'} {
  const stylesheet: CSSStyleSheet;
  export default stylesheet;
}