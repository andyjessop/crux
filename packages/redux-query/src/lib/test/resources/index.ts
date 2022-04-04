export const resources = {
  users: () => import('./user').then(mod => mod.users),
}