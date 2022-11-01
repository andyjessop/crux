import type { TodosData } from './todos.data';

export function initiateFetch(subscription: TodosData) {
  return subscription.refetch();
}
