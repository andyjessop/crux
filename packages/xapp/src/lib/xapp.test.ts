import {
  sliceOne, subscriptionOne, viewOne,
} from './mock/one';
import {
  sliceTwo, subscriptionTwo, viewTwo,
} from './mock/two';
import { xappWithEmitter as xapp } from './xapp-with-emitter';

import { layoutSelector, layoutView } from './mock/layout';

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
    
    const app = xapp({
      layoutSelector,
      slices,
      subscriptions,
      views,
    }, { headless: true });

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