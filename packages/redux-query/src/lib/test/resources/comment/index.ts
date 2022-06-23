
import { createDataAPI, PostComment, PutComment, Comment } from "../../api";
import { deleteComment, mergeComment, toData } from "./transformations";

export function createCommentConfig(api: ReturnType<typeof createDataAPI>) {
  return {
    query: () => api.comment
      .getAll()
      .then(toData),
    mutations: {
      create: {
        query: (comment: PostComment) => api.comment.post(comment)
      },
      delete: {
        query: (id: number) => api.comment.delete(id),
        options: {
          optimisticUpdate: (user: Comment) => (data: Comment[] | null) => deleteComment(data, user),
        }
      },
      update: {
        query: (comment: PutComment) => api.comment.put(comment),
        options: {
          optimisticUpdate: (user: PutComment) => (data: Comment[] | null) => mergeComment(data, user),
        }
      },
    },
    options: {
      lazy: true,
      keepUnusedDataFor: 60,
      pollingInterval: 360,
    },
  }
}