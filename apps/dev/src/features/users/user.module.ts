export function createUserModule(subscribe) {
  const { refetch } = subscribe();

  refetch();
  return {};
}