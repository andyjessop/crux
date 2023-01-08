import { createEventEmitter } from '@crux/event-emitter';
import { Subscription } from './subscription';
import { Slice, View } from './types';
import { Events, Options, crux } from './crux';

export function cruxWithEmitter(
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

  const app = crux(args, {
    ...options,
    emitter,
  });

  return {
    ...app,
    ...emitter,
  };
}
