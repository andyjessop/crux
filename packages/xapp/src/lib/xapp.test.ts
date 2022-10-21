import {
  sliceOne, subscriptionOne, viewOne,
} from './mock/one';
import {
  sliceTwo, subscriptionTwo, viewTwo,
} from './mock/two';
import { xappWithEmitter as xapp } from './xapp-with-emitter';

import { layoutView } from './mock/layout';

describe('xapp', () => {
  it('should create an xapp', (done) => {
    const slices = [
      sliceOne,
      sliceTwo,
    ];

    const subscriptions = [
      subscriptionOne,
      subscriptionTwo
    ];

    const views = [
      layoutView,
      viewOne,
      viewTwo
    ];
    
    debugger; // eslint-disable-line no-debugger

    const app = xapp({
      slices,
      subscriptions,
      views,
    });

    app.once('afterSubscriptions', (data) => {
      const state = app.store.getState();

      expect(state).toEqual({
        sliceOne: {
          isOne: true,
        },
        sliceTwo: {
          isTwo: true,
        },
      });

      done();
    });
  });
});