import { createCore } from './core';
import { createMockLayout, Region, State } from './mock-layout';
import { createMockModule } from './mock-modules';
import { createMockStore } from './mock-store';
import { createMockEventEmitter } from './mock-emitter';
import { Event } from '..';

const initialState: State = {
  sidebarIsOpen: false
} 

describe('core', () => {
  it('should have destroy and onStateUpdate methods', () => {
    const el = {} as HTMLElement;
    const mockStore = createMockStore(initialState);
    const mockLayout = createMockLayout();
    const mockEmitter = createMockEventEmitter();

    const core = createCore(mockStore, mockLayout, el, mockEmitter);

    expect(typeof core.destroy).toEqual('function');
    expect(core.modules).toBeInstanceOf(Map);
    expect(typeof core.onStateUpdate).toEqual('function');
    expect(mockEmitter.emit.mock.calls).toEqual([
      [Event.Create, { core }],
    ]);
  });

  it('should create module linked to new region', async () => {
    const el = {} as HTMLElement;
    const mockStore = createMockStore(initialState);
    const mockModule = createMockModule();
    const mockLayout = createMockLayout();
    const mockEmitter = createMockEventEmitter();

    const core = createCore(mockStore, mockLayout, el, mockEmitter);

    const { modules, onStateUpdate } = core;

    // Define module for a the sidebar region
    modules.set(Region.Sidebar, mockModule);

    // Open the sidebar
    const state = mockStore.getState();
    state.sidebarIsOpen = true;

    await onStateUpdate();

    expect(mockModule.create).toBeCalledTimes(1);
    expect(mockEmitter.emit.mock.calls).toEqual([
      [Event.Create, { core }],
      [Event.onNewState, { core, state }],
      [Event.onNewRegions, { core, regions: [Region.Nav, Region.Main, Region.Sidebar] }],
      [Event.OnModulesDestroyed, { core, modules: [] }],
      [Event.OnModulesCreated, { core, modules: [mockModule] }],
    ]);
  });

  it('should destroy module linked to old region', async () => {
    const el = {} as HTMLElement;
    const mockStore = createMockStore(initialState);
    const mockModule = createMockModule();
    const mockLayout = createMockLayout();

    const { modules, onStateUpdate } = createCore(mockStore, mockLayout, el);

    // Define module for a the sidebar region
    modules.set(Region.Sidebar, mockModule);

    // Open the sidebar
    const state = mockStore.getState();
    state.sidebarIsOpen = true;

    await onStateUpdate();

    state.sidebarIsOpen = false;

    await onStateUpdate();

    expect(mockModule.destroy).toBeCalledTimes(1);
  });
});
