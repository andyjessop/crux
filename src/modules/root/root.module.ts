export function createRootModule() {
  return {
    initialState: {
      first: false
    },
    showSidebar,
  };

  function showSidebar(show = true) {
    return {
      state: { sidebar: show },
    }
  }
}