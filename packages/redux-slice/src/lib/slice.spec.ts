import { createSlice } from './slice';

describe('reduxQuery', () => {
  it('should work', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, api, reducer } = createSlice<{
      add: number,
      subtract: number,
    }>()('counter', initial, {
      add: (state, payload) => ({
        ...state,
        count: state.count + payload
      }),
      subtract: (state, payload) => ({
        ...state,
        count: state.count - payload
      }),
    });

    const { add, subtract } = actions;

    expect(reducer(undefined, { type: add.type, payload: 1 })).toEqual({ count: 1 });
    expect(reducer(initial, { type: add.type, payload: 1 })).toEqual({ count: 1});
    expect(reducer(initial, { type: add.type, payload: undefined })).toEqual({ count: NaN });

    expect(actions.add.name).toEqual('actionCreator');
    expect(actions.add.type).toEqual(add.type);

    expect(actions.add(1)).toEqual({ payload: 1, type: add.type });
    expect(actions.subtract(2)).toEqual({ payload: 2, type: subtract.type });
  });

  it('should handle multiple parameters', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      add: [number, number],
    }>()('counter', initial, {
      add: (state, one, two) => ({
        ...state,
        count: state.count + one + two
      }),
    });

    const { add } = actions;

    expect(add(1, 2)).toEqual({ payload: [1, 2], type: add.type });
    expect(reducer(initial, { type: add.type, payload: [1, 2] })).toEqual({ count: 3 });
  });

  it('should handle multiple parameters (2)', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      add: [undefined, number],
      addOptional: [number, number?],
    }>()('counter', initial, {
      add: (state, one, two) => ({
        ...state,
        count: state.count + two
      }),
      addOptional: (state, one, two) => ({
        ...state,
        count: state.count + one + (two ?? 0)
      }),
    });

    const { add, addOptional } = actions;

    expect(add(undefined, 2)).toEqual({ payload: [undefined, 2], type: add.type });
    expect(reducer(initial, { type: add.type, payload: [1, 2] })).toEqual({ count: 2 });

    expect(addOptional(2)).toEqual({ payload: [2], type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: [2] })).toEqual({ count: 2 });

    expect(addOptional(2, 1)).toEqual({ payload: [2, 1], type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: [2, 1] })).toEqual({ count: 3 });
  });

  it('should handle optional parameters (1)', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      addOptional: number | void,
    }>()('counter', initial, {
      addOptional: (state, one) => ({
        ...state,
        count: state.count + (one ?? 0)
      }),
    });

    const { addOptional } = actions;

    expect(addOptional(2)).toEqual({ payload: 2, type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: 2 })).toEqual({ count: 2 });

    expect(addOptional()).toEqual({ payload: undefined, type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: undefined })).toEqual({ count: 0 });
  });

  it('should handle optional parameters (2)', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      addOptional: [number, number?],
    }>()('counter', initial, {
      addOptional: (state, one, two) => ({
        ...state,
        count: state.count + one + (two ?? 0)
      }),
    });

    const { addOptional } = actions;

    // redux-slice will always pass the payload as an array if there are multiple parameters in the config
    expect(actions.addOptional(2)).toEqual({ payload: [2], type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: [2] })).toEqual({ count: 2 });

    expect(actions.addOptional(2, 1)).toEqual({ payload: [2, 1], type: addOptional.type });
    expect(reducer(initial, { type: addOptional.type, payload: [2, 1] })).toEqual({ count: 3 });
  });

  it('should work with array type params', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      add: number[],
    }>()('counter', initial, {
      add: (state, one) => ({
        ...state,
        count: state.count + one.reduce((acc, cur) => acc + cur, 0),
      }),
    });

    const { add } = actions;

    expect(add([1, 2])).toEqual({ payload: [1, 2], type: add.type });
    expect(reducer(initial, { type: add.type, payload: [1, 2] })).toEqual({ count: 2 });
  });

  it('should produce API from actions', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { api, reducer } = createSlice<{
      add: number[],
    }>()('counter', initial, {
      add: (state, one) => ({
        ...state,
        count: state.count + one.reduce((acc, cur) => acc + cur, 0),
      }),
    });

    const { add } = api;

    expect(add([1, 2])).not.toBeUndefined();
  });
});