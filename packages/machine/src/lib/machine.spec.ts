import { machine } from './machine';

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

describe('machine', () => {
  test('get current state', () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    expect(testMachine.getState()).toEqual('off');
  });

  test('change state asynchronously', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    await testMachine.transition('switchOn');

    expect(testMachine.getState()).toEqual('on');

    await testMachine.transition('switchOff');

    expect(testMachine.getState()).toEqual('off');
  });

  test('listen to state changes', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    testMachine.onExit(() => {
      expect(testMachine.getState()).toEqual('off');
    });

    testMachine.onEnter(() => {
      expect(testMachine.getState()).toEqual('on');
    });

    await testMachine.transition('switchOn');
  });

  test('create shorthand methods for actions', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    await testMachine.switchOn();

    expect(testMachine.getState()).toEqual('on');

    await testMachine.switchOff();

    expect(testMachine.getState()).toEqual('off');
  });

  test('create shorthand methods for events', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    testMachine.onOn((data) => {
      const { action, current, last } = data;

      expect(testMachine.getState()).toEqual('on');
      expect(action).toEqual('switchOn');
      expect(current).toEqual('on');
      expect(last).toEqual('off');
    });

    testMachine.onOff((data) => {
      const { action, current, last } = data;

      expect(testMachine.getState()).toEqual('off');
      expect(action).toEqual('switchOff');
      expect(current).toEqual('off');
      expect(last).toEqual('on');
    });

    await testMachine.switchOn();

    expect(testMachine.getState()).toEqual('on');

    await testMachine.switchOff();

    expect(testMachine.getState()).toEqual('off');
  });

  test('listen to wait for async listeners before completing transition', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });
    let asyncWorkDone = false;

    testMachine.onExit(
      async () =>
        new Promise<void>((resolve) => {
          // Set a small delay before the `onExit` handler resolves.
          setTimeout(() => {
            // Check that state has not yet changed.
            expect(testMachine.getState()).toEqual('off');

            asyncWorkDone = true;
            resolve();
          }, 400);
        })
    );

    // OnEnter is fired immediately after calculating the next state, so if asyncWorkDone = true
    // here it means that the FSM waited for the previous promise
    testMachine.onEnter(({ current }) => {
      expect(asyncWorkDone).toEqual(true);
      expect(testMachine.getState()).toEqual('on');
      expect(current).toEqual('on');
    });

    await testMachine.transition('switchOn');
  });

  test('transparently pass data through transition', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    testMachine.onOn(({ meta }) => {
      expect(meta).toEqual(['test']);
    });

    await testMachine.switchOn('test');
  });

  test('transparently pass data through transition', async () => {
    const testMachine = machine(lightSwitch, { initialState: 'off' });

    testMachine.onOn(({ meta }) => {
      expect(meta).toEqual(['test', 'test2']);
    });

    await testMachine.switchOn('test', 'test2');
  });
});