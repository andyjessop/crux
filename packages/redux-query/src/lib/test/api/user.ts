import { User } from "../types/user";

export const api = {
  getAll: (): Promise<Response<User[]>> => Promise.resolve({
    data: [
      { id: '1', name: 'name1' },
      { id: '2', name: 'name2' }
    ],
  }),
  get: (id: User['id']): Promise<Response<User>> => new Promise((resolve, reject) => {
    if (id !== '1') {
      reject({
        error: {
          code: '404',
          message: 'User not found',
        },
      });
    }

    resolve({
      data: {
        id,
        name: 'name'
      }
    });
  }),
  post: (user: PostUser): Promise<Response<User>> => new Promise((resolve, reject) => {
    if (!user.name) {
      reject({
        error: {
          code: '400',
          message: 'Bad request',
        },
      });
    }

    resolve({
      data: {
        ...user,
        id: '2',
      } as User
    });
  }),
  put: (user: PutUser): Promise<Response<User>> => new Promise((resolve, reject) => {
    if (!user.id) {
      reject({
        error: {
          code: '400',
          message: 'Bad request',
        },
      });
    }

    resolve({
      data: {
        ...user,
      } as User
    });
  }),
  delete: (id: string): Promise<Response<User>> => new Promise((resolve, reject) => {
    if (id !== '1') {
      reject({
        error: {
          code: '400',
          message: 'Bad request',
        },
      });
    }

    resolve({
      data: {} as User
    });
  }),
}

export type PostUser = Omit<User, 'id'>;
export type PutUser = Partial<User> & Pick<User, 'id'>;

export interface Response<T> {
  data: T
}

export interface ErrorResponse {
  error: {
    code: string,
    message: string
  }
}