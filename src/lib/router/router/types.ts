import type { API as EventEmitter, Handler } from '../../event-emitter/event-emitter';

export namespace Router {
  export interface API extends EventEmitter {
    back(): void;
    destroy(): void;
    forward(): void;
    getCurrentRoute(): Router.RouteData | null;
    go(num: number): void;
    navigate(name: string, params?: RouteParams): void;
    register(name: string, path: string): true | null;
    replace(name: string, params?: RouteParams): void;
  }

  export interface CurrentRoute {
    params: any;
    route: Route;
  }

  export enum Events {
    Transition = 'transition',
  }

  export interface Route {
    decodeURL(url: string): null | RouteParams;
    encodeURL(dict: RouteParams): string;
    name: string;
  }

  export interface RouteData {
    name: string;
    params: any;
  }

  export type Routes = Record<string, Route>;

  export type RouteParams = Record<string, string | null | string[]>;
}
