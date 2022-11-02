export enum Variable {
  VITE_API_URL,
}

export interface Env {
  get(key: Variable): string;
}

export function env(): Env {
  const variables: Record<Variable, string> = {
    [Variable.VITE_API_URL]: import.meta.env.VITE_API_URL,
  };

  return {
    get,
  };

  function get(key: Variable) {
    return variables[key];
  }
}
