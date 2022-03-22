// import { createSlice } from "..";

// type Get<D, E> = {
//   query: (...args: any[]) => Promise<unknown>,
//   optimistic?: boolean,
//   onSuccess: (response: unknown) => D,
//   onError: (response: unknown) => E,
//   url: string,
// };

// type Delete<E> = {
//   query: (...args: any[]) => Promise<unknown>,
//   optimistic?: boolean,
//   onError: (response: unknown) => E,
//   url: string,
// };

// function createDataSlice<D, E>({
//   base, delete, get,
// }: {
//   base: string;
//   delete?: Delete<E>;
//   get?: Get<D, E>;
// }) {
//   type State = {
//     data: D | null,
//     error: E | null,
//     loading: boolean,
//   }

//   const initialState: State = {
//     data: null,
//     error: null,
//     loading: false,
//   }

//   const slice = createSlice({
//     [`${base}/pending`]: (state: State) => ({
//       ...state,
//       loading: true,
//     }),

//     [`${base}/fulfilled`]: (state: State, payload: unknown) => ({
//       ...state,
//       data: onSuccess?.(payload) ?? payload,
//       error: null,
//       loading: false,
//     }),

//     [`${base}/rejected`]: (state: State, payload: E) => ({
//       ...state,
//       data: null,
//       error: onError?.(payload) ?? payload,
//       loading: false,
//     }),
//   }, { initialState });

//   return slice.actions[`${base}/pending`];
// }