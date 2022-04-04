import { createEventEmitter } from '@crux/event-emitter';
import { createDataSlice, Events } from './create-data-slice';
import { user } from './test/resources/user';

const onPending = jest.fn();
const onFulfilled = jest.fn();
const onRejected = jest.fn();

const initialState = {
  data: null,
  error: null,
  loading: false,
  updating: false,
}

let emitter = createEventEmitter<Events>();

describe('createEndpoint', () => {
  beforeEach(() => {
    onPending.mockClear();
    onFulfilled.mockClear();
    onRejected.mockClear();
    emitter = createEventEmitter<Events>();
    emitter.on('pending', onPending);
    emitter.on('fulfilled', onFulfilled);
    emitter.on('rejected', onRejected);
  
  });

  test('get user', () => {
    const { api, options, type } = user['get'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'get',
      options,
      resource: 'user',
      type,
    });

    const pendingAction = { payload: '1', type: 'user/get/pending' };
    const fulfilledAction = { payload: { id: '1', name: 'name' }, type: 'user/get/fulfilled' };

    call('1')
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual({
      ...initialState,
      data: { id: '1', name: 'name' },
      });
  });

  test('get 404 user', () => {
    const { api, options, type } = user['get'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'get',
      options,
      resource: 'user',
      type,
    });

    const pendingAction = { payload: '2', type: 'user/get/pending' };
    const rejectedAction = { payload: { code: '404', message: 'User not found' }, type: 'user/get/rejected' };

    call('2').catch(() => {
      expect(onPending.mock.calls).toEqual([
        [pendingAction],
      ]);

      expect(onRejected.mock.calls).toEqual([
        [rejectedAction],
      ]);
    });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, rejectedAction)).toEqual({
      ...initialState,
      error: { code: '404', message: 'User not found' },
    });
  });

  test('clear data on error', async () => {
    const { api, options, type } = user['get'];

    if (options) {
      options.clearDataOnError = true;
    }

    const { reducer } = createEndpoint({
      api,
      emitter,
      name: 'get',
      options,
      resource: 'user',
      type,
    });

    const pendingAction = { payload: undefined, type: 'user/get/pending' };
    const rejectedAction = { payload: { code: '404', message: 'User not found' }, type: 'user/get/rejected' };
    const fulfilledAction = { payload: { id: '1', name: 'name' }, type: 'user/get/fulfilled' };

    expect(
      reducer(reducer(reducer(initialState, pendingAction), fulfilledAction), rejectedAction)
    ).toEqual({
      ...initialState,
      error: { code: '404', message: 'User not found' },
    });
  });

  test('post user', () => {
    const { api, type } = user['post'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'post',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { name: 'name' }, type: 'user/post/pending' };
    const fulfilledAction = { payload: { id: '2', name: 'name' }, type: 'user/post/fulfilled' };

    call({ name: 'name' })
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual({
      ...initialState,
      data: { id: '2', name: 'name' },
      });
  });

  test('post 400 user', () => {
    const { api, type } = user['post'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'post',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { invalidProp: true }, type: 'user/post/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/post/rejected' };

    call({ invalidProp: true })
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, rejectedAction)).toEqual({
      ...initialState,
      data: null,
      error: {
        code: '400',
        message: 'Bad request'
      }
      });
  });

  test('post user optimistic', () => {
    const { api, type } = user['post'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'post',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { name: 'name' }, type: 'user/post/pending' };
    const fulfilledAction = { payload: { id: '2', name: 'name' }, type: 'user/post/fulfilled' };

    call({ name: 'name' })
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      data: { name: 'name' },
      loading: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual({
      ...initialState,
      data: { id: '2', name: 'name' },
      });
  });

  test('post 400 user optimistic', () => {
    const { api, type } = user['post'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'post',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { invalidProp: true }, type: 'user/post/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/post/rejected' };

    call({ invalidProp: true })
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      data: { invalidProp: true },
      loading: true,
    });

    expect(reducer(initialState, rejectedAction)).toEqual({
      ...initialState,
      error: {
        code: '400',
        message: 'Bad request'
      }
      });
  });

  test('put user', () => {
    const { api, type } = user['put'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'put',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { id: '1', name: 'name' }, type: 'user/put/pending' };
    const fulfilledAction = { payload: { id: '1', name: 'name' }, type: 'user/put/fulfilled' };

    call({ id: '1', name: 'name' })
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    const state = {
      ...initialState,
      data: { id: '1', name: 'previousName' },
    }

    expect(reducer(state, pendingAction)).toEqual({
      ...state,
      loading: true,
      updating: true,
    });

    expect(reducer(state, fulfilledAction)).toEqual({
      ...state,
      data: { id: '1', name: 'name' },
      });
  });

  test('put 400 user', () => {
    const { api, type } = user['put'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'put',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { invalidProp: true }, type: 'user/put/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/put/rejected' };

    call({ invalidProp: true })
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    const state = {
      ...initialState,
      data: { id: '1', name: 'previousName' },
    };

    expect(reducer(state, pendingAction)).toEqual({
      ...state,
      loading: true,
      updating: true,
    });

    expect(reducer(state, rejectedAction)).toEqual({
      ...state,
      error: {
        code: '400',
        message: 'Bad request'
      }
    });
  });

  test('put user optimistic', () => {
    const { api, type } = user['put'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'put',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { id: '1', name: 'name' }, type: 'user/put/pending' };
    const fulfilledAction = { payload: { id: '1', name: 'name' }, type: 'user/put/fulfilled' };

    call({ id: '1', name: 'name' })
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    const state = {
      ...initialState,
      data: { id: '1', name: 'previousName' },
    };

    expect(reducer(state, pendingAction)).toEqual({
      ...initialState,
      data: { id: '1', name: 'name' },
      loading: true,
      updating: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual({
      ...initialState,
      data: { id: '1', name: 'name' },
    });
  });

  test('put 400 user optimistic', () => {
    const { api, type } = user['put'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'put',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: { invalidProp: true }, type: 'user/put/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/put/rejected' };

    call({ invalidProp: true })
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    const state = {
      ...initialState,
      data: { id: '1', name: 'previousName' },
    };

    expect(reducer(state, pendingAction)).toEqual({
      ...initialState,
      data: { id: '1', invalidProp: true, name: 'previousName' },
      loading: true,
      updating: true,
    });

    expect(reducer(state, rejectedAction)).toEqual({
      ...state,
      error: {
        code: '400',
        message: 'Bad request'
      }
    });
  });

  test('delete user', () => {
    const { api, type } = user['delete'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'delete',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: '1', type: 'user/delete/pending' };
    const fulfilledAction = { payload: {}, type: 'user/delete/fulfilled' };

    call('1')
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual({
      ...initialState,
      data: null,
    });
  });

  test('delete 400 user', () => {
    const { api, type } = user['delete'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'delete',
      resource: 'user',
      type,
    });

    const pendingAction = { payload: 'not-a-user-id', type: 'user/delete/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/delete/rejected' };

    call('not-a-user-id')
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(initialState, rejectedAction)).toEqual({
      ...initialState,
      data: null,
      error: {
        code: '400',
        message: 'Bad request'
      }
      });
  });

  test('delete user optimistic', () => {
    const { api, type } = user['delete'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'delete',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: '1', type: 'user/delete/pending' };
    const fulfilledAction = { payload: {}, type: 'user/delete/fulfilled' };

    call('1')
      .then(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);

        expect(onFulfilled.mock.calls).toEqual([
          [fulfilledAction],
        ]);
      });

    expect(reducer(initialState, pendingAction)).toEqual({
      ...initialState,
      data: null,
      loading: true,
    });

    expect(reducer(initialState, fulfilledAction)).toEqual(initialState);
  });

  test('delete 400 user optimistic', () => {
    const { api, type } = user['delete'];

    const { call, reducer } = createEndpoint({
      api,
      emitter,
      name: 'delete',
      options: {
        optimistic: true,
      },
      resource: 'user',
      type,
    });

    const pendingAction = { payload: 'not-a-user-id', type: 'user/delete/pending' };
    const rejectedAction = { payload: { code: '400', message: 'Bad request' }, type: 'user/delete/rejected' };

    call('not-a-user-id')
      .catch(() => {
        expect(onPending.mock.calls).toEqual([
          [pendingAction],
        ]);
  
        expect(onRejected.mock.calls).toEqual([
          [rejectedAction],
        ]);
      });

    const state = {
      ...initialState,
      data: { id: '1', name: 'name' }
    }

    expect(reducer(state, pendingAction)).toEqual({
      ...initialState,
      data: null,
      loading: true,
      updating: true,
    });

    expect(reducer(initialState, rejectedAction)).toEqual({
      ...state,
      error: {
        code: '400',
        message: 'Bad request'
      }
    });
  });
});