export interface User {
  id: number;
  name: string;
}

export type PostUser = Omit<User, 'id'>;
export type PutUser = Partial<User> & Pick<User, 'id'>;

export interface Comment {
  id: number;
  userId: number;
  body: string;
}

export type PostComment = Omit<Comment, 'id'>;
export type PutComment = Partial<Comment> & Pick<Comment, 'id'>;

export interface Response<T> {
  data: T;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export function createDataAPI() {
  const users: User[] = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ];

  const comments: Comment[] = [
    { id: 1, userId: 1, body: 'comment1' },
    { id: 2, userId: 1, body: 'comment2' },
    { id: 3, userId: 2, body: 'comment3' },
  ];

  return {
    comment: {
      getAll: (): Promise<Response<Comment[]>> =>
        Promise.resolve({
          data: comments,
        }),
      getOne: (id: number): Promise<Response<Comment>> =>
        new Promise((resolve, reject) => {
          const comment = comments.find((u) => u.id === id);

          if (!comment) {
            reject({
              error: {
                code: '404',
                message: 'Comment not found',
              },
            });
          }

          resolve({
            data: comment,
          });
        }),
      post: (comment: PostComment): Promise<Response<Comment>> =>
        new Promise((resolve, reject) => {
          const user = users.find((u) => u.id === comment.userId);

          if (!user || !comment.body) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          const lastId = Math.max(...comments.map((c) => c.id));

          const newComment = {
            ...comment,
            id: lastId + 1,
          };

          comments.push(newComment);

          resolve({
            data: newComment,
          });
        }),
      put: (comment: PutComment): Promise<Response<Comment>> =>
        new Promise((resolve, reject) => {
          const existingComment = comments.find((c) => c.id === comment.id);
          const user = users.find((u) => u.id === comment.userId);

          if (!user || !existingComment || !comment.body || comment.userId !== existingComment.id) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          Object.assign(existingComment, comment);

          resolve({
            data: existingComment,
          });
        }),
      delete: (id: number): Promise<Response<null>> =>
        new Promise((resolve, reject) => {
          const existingCommentNdx = comments.findIndex((c) => c.id === id);

          if (existingCommentNdx === -1) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          comments.splice(existingCommentNdx, 1);

          resolve({
            data: null,
          });
        }),
    },
    user: {
      getAll: (): Promise<Response<User[]>> =>
        Promise.resolve({
          data: users,
        }),
      getOne: (id: number): Promise<Response<User>> =>
        new Promise((resolve, reject) => {
          const user = users.find((u) => u.id === id);

          if (!user) {
            reject({
              error: {
                code: '404',
                message: 'User not found',
              },
            });
          }

          resolve({
            data: user,
          });
        }),
      post: (user: PostUser): Promise<Response<User>> =>
        new Promise((resolve, reject) => {
          if (!user.name) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          const lastId = Math.max(...users.map((user) => user.id));

          const newUser = {
            ...user,
            id: lastId + 1,
          };

          users.push(newUser);

          resolve({
            data: newUser,
          });
        }),
      put: (user: PutUser): Promise<Response<User>> =>
        new Promise((resolve, reject) => {
          const existingUser = users.find((u) => u.id === user.id);

          if (!existingUser) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          Object.assign(existingUser, user);

          resolve({
            data: existingUser,
          });
        }),
      delete: (id: number): Promise<Response<null>> =>
        new Promise((resolve, reject) => {
          const existingUserNdx = users.findIndex((u) => u.id === id);

          if (existingUserNdx === -1) {
            reject({
              error: {
                code: '400',
                message: 'Bad request',
              },
            });
          }

          users.splice(existingUserNdx, 1);

          resolve({
            data: null,
          });
        }),
    },
  };
}
