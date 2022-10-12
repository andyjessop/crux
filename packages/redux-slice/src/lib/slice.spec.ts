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
      add: (state: State, payload) => ({
        ...state,
        count: state.count + payload
      }),
      subtract: (state: State, payload: number) => ({
        ...state,
        count: state.count - payload
      }),
    });

    expect(reducer(undefined, { type: 'counter/add', payload: 1 })).toEqual({ count: 1 });
    expect(reducer(initial, { type: 'counter/add', payload: 1 })).toEqual({ count: 1});
    expect(reducer(initial, { type: 'counter/add', payload: undefined })).toEqual({ count: NaN });

    expect(actions.add.name).toEqual('actionCreator');
    expect(actions.add.type).toEqual('counter/add');

    expect(actions.add(1)).toEqual({ payload: 1, type: 'counter/add' });
    expect(actions.subtract(2)).toEqual({ payload: 2, type: 'counter/subtract' });
  });

  it('should handle multiple parameters', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      add: [number, number],
    }>()('counter', initial, {
      add: (state: State, one, two) => ({
        ...state,
        count: state.count + one + two
      }),
    });

    expect(actions.add(1, 2)).toEqual({ payload: [1, 2], type: 'counter/add' });
    expect(reducer(initial, { type: 'counter/add', payload: [1, 2] })).toEqual({ count: 3 });
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
      add: (state: State, one, two) => ({
        ...state,
        count: state.count + two
      }),
      addOptional: (state: State, one, two) => ({
        ...state,
        count: state.count + one + (two ?? 0)
      }),
    });

    expect(actions.add(undefined, 2)).toEqual({ payload: [undefined, 2], type: 'counter/add' });
    expect(reducer(initial, { type: 'counter/add', payload: [1, 2] })).toEqual({ count: 2 });

    expect(actions.addOptional(2)).toEqual({ payload: [2], type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: [2] })).toEqual({ count: 2 });

    expect(actions.addOptional(2, 1)).toEqual({ payload: [2, 1], type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: [2, 1] })).toEqual({ count: 3 });
  });

  it('should handle optional parameters (1)', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      addOptional: number | void,
    }>()('counter', initial, {
      addOptional: (state: State, one) => ({
        ...state,
        count: state.count + (one ?? 0)
      }),
    });

    expect(actions.addOptional(2)).toEqual({ payload: 2, type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: 2 })).toEqual({ count: 2 });

    expect(actions.addOptional()).toEqual({ payload: undefined, type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: undefined })).toEqual({ count: 0 });
  });

  it('should handle optional parameters (2)', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, reducer } = createSlice<{
      addOptional: [number, number?],
    }>()('counter', initial, {
      addOptional: (state: State, one, two) => ({
        ...state,
        count: state.count + one + (two ?? 0)
      }),
    });

    expect(actions.addOptional(2)).toEqual({ payload: [2], type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: [2] })).toEqual({ count: 2 });

    expect(actions.addOptional(2, 1)).toEqual({ payload: [2, 1], type: 'counter/addOptional' });
    expect(reducer(initial, { type: 'counter/addOptional', payload: [2, 1] })).toEqual({ count: 3 });
  });
});