import { serialize } from "../../../helpers/serializer";
import { State } from "../../../types";
import { ErrorResponse, PutUser, Response } from "../../api/user";
import { Error, User } from "../../types/user";

export function toError(response: ErrorResponse): string {
  throw new Error(serialize(response.error));
}

export function toData(response: Response<User[]>) {
  return response.data;
}

export function toNull() {
  return null;
}

export function toUndefined() {
  return undefined;
}

export function postResponseToData(state: State<User[], Error>, response: Response<User>) {
  return [
    ...state.data || [],
    response.data,
  ];
}

export function mergeUser(state: State<User[], Error>, user: PutUser) {
  const data = state.data;

  if (data === null) {
    return data;
  }

  const ndx = data?.findIndex(u => u.id === user.id);

  if (ndx === -1) {
    return data;
  }

  data[ndx] = {
    ...data[ndx],
    ...user
  };

  return data;
}