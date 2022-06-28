import type { Action } from "./action";

export interface UI<State> {
  render(state: State): void;
}

export type Reducer<State = unknown> = (state: State, action: Action) => State;

export type Selector<State> = (state: State) => unknown;

export interface ModuleAPI {
  addEventListener(type: string, callback: (...args: unknown[]) => void): void;
  dispatch(action: Action): Promise<void>;
  registerReducer(name: string, reducer: Reducer): boolean;
  registerService(name: string, constructor: () => unknown): boolean;
}

export type Module = (api: ModuleAPI) => (...args: unknown[]) => {
  created(): void;
  destroyed(): void;
}
