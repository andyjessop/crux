import { createSlice } from './redux-query';

describe('reduxQuery', () => {
  it('should work', () => {
    interface State {
      count: number;
    }
    
    const initial: State = { count: 0 };
    
    const { actions, getType, reducer } = createSlice({
      add: (state: State, payload: number) => ({
        ...state,
        count: state.count + payload
      }),
      subtract: (state: State, payload: number) => ({
        ...state,
        count: state.count - payload
      }),
    }, { initialState: initial, name: 'counter' });

    expect(reducer(undefined, { type: 'counter/add', payload: 1 })).toEqual({ count: 1 });
    expect(reducer(initial, { type: 'counter/add', payload: 1 })).toEqual({ count: 1});
    expect(reducer(initial, { type: 'counter/add', payload: undefined })).toEqual({ count: NaN });

    expect(getType('add')).toEqual('counter/add');

    expect(actions.add(1)).toEqual({ payload: 1, type: 'counter/add' });
    expect(actions.subtract(2)).toEqual({ payload: 2, type: 'counter/subtract' });
  });
});
