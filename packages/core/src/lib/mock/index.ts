import { createMockEventEmitter } from "./emitter";
import { createMockLayout } from "./layout";
import { createMockModule } from "./module";
import { createMockStore } from "./store";
import { State } from "./types";

const initialState: State = {
  sidebarIsOpen: false
} 

export function createMock() {
  return {
    el:  {} as HTMLElement,
    emitter: createMockEventEmitter(),
    layout: createMockLayout(),
    module: createMockModule(),
    store: createMockStore(initialState),
  }
}