import { service } from '../../service';
import { slice } from '../../slice';
import { subscription } from '../../subscription';
import { view } from '../../view';
import { sharedService } from '../shared';
import { selectorTwo } from './selector';
export { selectorTwo } from './selector';

export const serviceTwo = service(() => import('./service').then((mod) => mod.serviceTwo()));

export const sliceTwo = slice(
  (two, shared) => import('./slice').then((mod) => mod.sliceTwo(two, shared)),
  {
    deps: [serviceTwo, sharedService],
    name: 'sliceTwo',
  }
);

export const subscriptionTwo = subscription(
  () => import('./subscription').then((mod) => mod.subscriptionTwo),
  { deps: [sliceTwo, selectorTwo] }
);

export const viewTwo = view(() => import('./view').then((mod) => mod.viewTwo), {
  actions: sliceTwo,
  data: selectorTwo,
  root: 'viewTwo',
});

export const selectTwo = sliceTwo.selector;
