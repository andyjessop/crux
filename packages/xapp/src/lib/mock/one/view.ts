import { ServiceOne } from "./service";

export function viewOne(root: HTMLElement) {
  return function(data: number, actions: ServiceOne) {
    console.log(data, actions);
  }
}