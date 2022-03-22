export interface Module<S> {
  update: (state: S) => S;
}

export interface View {
  mount: (root: HTMLElement, subscribe: Subscribe) => void;
  unmount: (root: HTMLElement) => void;
}

type Destroy = () => void;
export type Subscribe = <S, T>(selector: (state: S) => T, callback: (derived: T) => void) => Destroy;