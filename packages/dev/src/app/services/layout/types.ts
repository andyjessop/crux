export type Render<T> = (state: T) => boolean;
export type Layout<T>= (root: HTMLElement) => Render<T>;
