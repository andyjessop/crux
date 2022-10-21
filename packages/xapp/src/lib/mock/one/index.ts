import { service } from "../../service";
import { slice } from "../../slice";
import { subscription } from "../../subscription";
import { view } from "../../view";
import { sharedService } from "../shared";
import { selectorOne } from "./selector";

export const serviceOne = service(() => import('./service').then(mod => mod.serviceOne()));

export const sliceOne = slice((one, shared) => import('./slice').then(mod => mod.sliceOne(one, shared)), {
  deps: [serviceOne, sharedService],
  name: 'sliceOne'
});

export const subscriptionOne = subscription(
  () => import('./subscription').then(mod => mod.subscriptionOne),
  { deps: [sliceOne, selectorOne] },
);

export const viewOne = view(
  () => import('./view').then(mod => mod.viewOne),
  {
    actions: serviceOne,
    data: selectorOne,
    root: 'viewOne',
  }
);

export const selectOne = sliceOne.selector;