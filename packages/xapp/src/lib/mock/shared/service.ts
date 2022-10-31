export type SharedService = ReturnType<typeof sharedService>;

export function sharedService() {
  return {
    destroy: () => {
      /* */
    },
  };
}
