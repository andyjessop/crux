import { createCore, Event } from './core';
import { createMock } from './mock';
import { Region } from './mock/types';

describe('core', () => {
  it('should have destroy and onStateUpdate methods', () => {
    const {
      el, emitter, layout, store
    } = createMock();

    const core = createCore(store, layout, el, emitter);

    expect(typeof core.destroy).toEqual('function');
    expect(core.modules).toBeInstanceOf(Map);
    expect(typeof core.onStateUpdate).toEqual('function');
    expect(emitter.emit.mock.calls).toEqual([
      [Event.Create, { core }],
    ]);
  });

  it('should create module linked to new region', async () => {
    const {
      el, emitter, layout, module, store
    } = createMock();

    const core = createCore(store, layout, el, emitter);

    const { modules, onStateUpdate } = core;

    // Define module for a the sidebar region
    modules.set(Region.Sidebar, module);

    // Open the sidebar
    const state = store.getState();
    state.sidebarIsOpen = true;

    await onStateUpdate();

    expect(module.create).toBeCalledTimes(1);
    expect(emitter.emit.mock.calls).toEqual([
      [Event.Create, { core }],
      [Event.onNewState, { core, state }],
      [Event.onNewRegions, { core, regions: [Region.Nav, Region.Main, Region.Sidebar] }],
      [Event.OnModulesDestroyed, { core, modules: [] }],
      [Event.OnModulesCreated, { core, modules: [module] }],
    ]);
  });

  it('should destroy module linked to old region', async () => {
    const {
      el, emitter, layout, module, store
    } = createMock();

    const core = createCore(store, layout, el, emitter);

    const { modules, onStateUpdate } = core;

    // Define module for a the sidebar region
    modules.set(Region.Sidebar, module);

    // Open the sidebar
    const state = store.getState();
    state.sidebarIsOpen = true;

    await onStateUpdate();

    state.sidebarIsOpen = false;

    await onStateUpdate();

    expect(module.destroy).toBeCalledTimes(1);
    expect(emitter.emit.mock.calls.filter(
      call => call[0] === Event.OnModulesDestroyed
    )[1]).toEqual([Event.OnModulesDestroyed, { core, modules: [module] }]);
  });
});
