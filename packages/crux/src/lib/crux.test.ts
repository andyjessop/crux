import { sliceOne, subscriptionOne, viewOne } from './mock/one';
import { sliceTwo, subscriptionTwo, viewTwo } from './mock/two';
import { cruxWithEmitter as crux } from './crux-with-emitter';

import { layoutView } from './mock/layout';

describe('crux', () => {
  it('should create an crux', (done) => {
    const slices = [sliceOne, sliceTwo];

    const subscriptions = [subscriptionOne, subscriptionTwo];

    const views = [layoutView, viewOne, viewTwo];

    const app = crux({
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
