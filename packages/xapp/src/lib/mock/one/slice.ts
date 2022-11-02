import { createSlice } from '@crux/redux-slice';
import { SharedService } from '../shared/service';
import { ServiceOne } from './service';

export type SliceOne = ReturnType<typeof sliceOne>['api'];

export function sliceOne(serviceOne: ServiceOne, shared: SharedService) {
  const slice = createSlice(
    'sliceOne',
    { isOne: true },
    {
      set: () => ({}),
    }
  );

  return slice; // api, middleware, reducer
}
