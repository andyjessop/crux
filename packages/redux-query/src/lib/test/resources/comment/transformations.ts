import { serialize } from "../../../helpers/serializer";
import { ErrorResponse, Comment, PutComment, Response } from "../../api";

export function toError(response: ErrorResponse): string {
  throw new Error(serialize(response.error));
}

export function toData(response: Response<Comment[]>) {
  return response.data;
}

export function toNull() {
  return null;
}

export function toUndefined() {
  return undefined;
}

export function postResponseToData(data: Comment[] | null, response: Response<Comment>) {
  return [
    ...data || [],
    response.data,
  ];
}

export function deleteComment(data: Comment[] | null, comment: Comment) {
  if (data === null) {
    return data;
  }


  return data.filter(c => comment.id !== c.id);
}

export function mergeComment(data: Comment[] | null, comment: PutComment) {
  if (data === null) {
    return data;
  }

  const ndx = data?.findIndex(c => c.id === comment.id);

  if (ndx === -1) {
    return data;
  }

  data[ndx] = {
    ...data[ndx],
    ...comment
  };

  return data;
}