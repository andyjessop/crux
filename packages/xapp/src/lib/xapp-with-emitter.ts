import { createEventEmitter } from '@crux/event-emitter';
import { Subscription } from './subscription';
import { Slice, View } from './types';
import { Events, Options, xapp } from './xapp';

export function xappWithEmitter(
  args: {
    layoutSelector?: (state: any) => { [key: string]: string };
    root?: HTMLElement;
    slices: Slice[];
    subscriptions: Subscription[];
    views: View[];
  },
  options: Options = {}
) {
  const emitter = createEventEmitter<Events>();

  const app = xapp(args, {
    ...options,
    emitter,
  });

  return {
    ...app,
    ...emitter,
  };
}
