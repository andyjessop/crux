export namespace EventEmitter {
  export interface API {
    addListener: (type: string, handler: Handler) => void;
    emit: (type: string, data?: any) => void;
    removeListener: (type: string, handler: Handler) => void;
  }

  export interface Event {
    data: any;
    type: string;
  }

  export interface Listener {
    type: string;
    handler: Handler;
  }

  export type Handler = (event: Event) => any;
}