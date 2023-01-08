import { createSlice } from '@crux/slice';
import { SharedService } from '../shared/service';
import { ServiceOne } from './service';

export type SliceOne = ReturnType<typeof sliceOne>['api'];

export function sliceOne(serviceOne: ServiceOne, shared: SharedService) {
  const slice = createSlice(
    'sliceOne',
    { isOne: true },
    {
      set: () => ({ isOne: true }),
    }
  );

  return slice; // api, middleware, reducer
}
