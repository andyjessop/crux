export interface User {
  id: number;
  email: string;
  roles: string[];
}

export interface Response<Data> {
  data: Data;
}

export type PostUser = Omit<User, 'id'>;
export type PutUser = Partial<User>;

export type Users = typeof createUsersHttp;
export type UsersAPI = ReturnType<typeof createUsersHttp>;

export function createUsersHttp() {
  const users: User[] = [
    { id: 1, email: 'name1', roles: ['admin'] },
    { id: 2, email: 'name2', roles: ['user'] },
  ];

  return {
    getAll: (): Promise<Response<User[]>> =>
      Promise.resolve({
        data: users,
      }),
    getOne: (id: number): Promise<Response<User | undefined>> =>
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
        if (!user.email) {
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
    put: (user: PutUser): Promise<Response<User | undefined>> =>
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

        Object.assign(existingUser as User, user);

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
  };
}
