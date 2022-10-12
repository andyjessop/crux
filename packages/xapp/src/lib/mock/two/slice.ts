import { createSlice } from "@crux/redux-slice";
import { SharedService } from "../shared/service";
import { ServiceTwo } from "./service";

export type SliceTwo = ReturnType<typeof sliceTwo>['api'];

export function sliceTwo(serviceTwo: ServiceTwo, shared: SharedService) {
  return createSlice<{
    set: void;
  }>()('module1', { isTwo: true }, {
    set: () => ({}),
  });
}