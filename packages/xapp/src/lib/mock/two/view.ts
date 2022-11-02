import { SliceTwo } from './slice';

export function viewTwo(root: HTMLElement) {
  return function (data: string, actions: SliceTwo) {
    console.log(data, actions);
  };
}
