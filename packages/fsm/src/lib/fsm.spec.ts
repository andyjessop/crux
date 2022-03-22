import { createFSM } from './fsm';

const lightSwitch = {
  off: {
    switchOn: () => 'on',
    switchOnAsync: () => Promise.resolve('on'),
  },
  on: {
    switchOff: () => 'off',
    switchOffAsync: () => Promise.resolve('on'),
  },
};

describe('fsm', () => {
  test('get current state', () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });

    expect(fsm.getState()).toEqual('off');
  });

  test('change state asynchronously', async () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });

    await fsm.transition('switchOn');

    expect(fsm.getState()).toEqual('on');

    await fsm.transition('switchOff');

    expect(fsm.getState()).toEqual('off');
  });

  test('listen to state changes', async () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });

    fsm.onExit(() => {
      expect(fsm.getState()).toEqual('off');
    });

    fsm.onEnter(() => {
      expect(fsm.getState()).toEqual('on');
    });

    await fsm.transition('switchOn');
  });

  test('create shorthand methods for actions', async () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });

    await fsm.switchOn();

    expect(fsm.getState()).toEqual('on');

    await fsm.switchOff();

    expect(fsm.getState()).toEqual('off');
  });

  test('create shorthand methods for events', async () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });

    fsm.onOn((data) => {
      const { action, current, last } = data;

      expect(fsm.getState()).toEqual('on');
      expect(action).toEqual('switchOn');
      expect(current).toEqual('on');
      expect(last).toEqual('off');
    });

    fsm.onOff((data) => {
      const { action, current, last } = data;

      expect(fsm.getState()).toEqual('off');
      expect(action).toEqual('switchOff');
      expect(current).toEqual('off');
      expect(last).toEqual('on');
    });

    await fsm.switchOn();

    expect(fsm.getState()).toEqual('on');

    await fsm.switchOff();

    expect(fsm.getState()).toEqual('off');
  });

  test('listen to wait for async listeners before completing transition', async () => {
    const fsm = createFSM(lightSwitch, { initialState: 'off' });
    let asyncWorkDone = false;

    fsm.onExit(
      async () =>
        new Promise<void>((resolve) => {
          // Set a small delay before the `onExit` handler resolves.
          setTimeout(() => {
            // Check that state has not yet changed.
            expect(fsm.getState()).toEqual('off');

            asyncWorkDone = true;
            resolve();
          }, 400);
        })
    );

    // OnEnter is fired immediately after calculating the next state, so if asyncWorkDone = true
    // here it means that the FSM waited for the previous promise
    fsm.onEnter(({ current }) => {
      expect(asyncWorkDone).toEqual(true);
      expect(fsm.getState()).toEqual('on');
      expect(current).toEqual('on');
    });

    await fsm.transition('switchOn');
  });
});
