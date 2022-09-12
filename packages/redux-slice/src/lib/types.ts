import { createSlice } from "./slice";

export type ApiOf<Slice> = ReturnType<ReturnType<typeof createSlice<Slice>>>['api'];