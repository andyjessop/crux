import { serialize } from '../../../helpers/serializer';
import { ErrorResponse, PutUser, Response, User } from '../../api';

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

export function postResponseToData(data: User[] | null, response: Response<User>) {
  return [...(data || []), response.data];
}

export function deleteUser(data: User[] | null, id: number) {
  if (data === null) {
    return data;
  }

  return data.filter((u) => id !== u.id);
}

export function mergeUser(data: User[] | null, user: PutUser) {
  if (data === null) {
    return data;
  }

  const ndx = data?.findIndex((u) => u.id === user.id);

  if (ndx === -1) {
    return data;
  }

  data[ndx] = {
    ...data[ndx],
    ...user,
  };

  return data;
}
