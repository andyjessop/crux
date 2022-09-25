export function createUserModule(subscribe: any) {
  const { refetch } = subscribe();

  refetch();
  return {};
}