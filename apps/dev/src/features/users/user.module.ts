import type { CruxContext } from "@crux/app";

export function createUserModule(ctx: CruxContext, subscribe: any) {
  const { refetch } = subscribe();

  refetch();
  return {};
}