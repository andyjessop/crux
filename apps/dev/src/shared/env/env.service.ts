export enum Variable {
  VITE_API_BASE_URL,
  VITE_API_SIGNUP_REDIRECT_URL,
  VITE_PUBLIC_API_KEY,
}

export interface Env {
  get(key: Variable): string;
}

export function env(): Env {
  const variables: Record<Variable, string> = {
    [Variable.VITE_API_BASE_URL]: import.meta.env.VITE_API_BASE_URL,
    [Variable.VITE_PUBLIC_API_KEY]: import.meta.env.VITE_PUBLIC_API_KEY,
    [Variable.VITE_API_SIGNUP_REDIRECT_URL]: import.meta.env.VITE_API_SIGNUP_REDIRECT_URL,
  }

  return {
    get,
  }

  function get(key: Variable) {
    return variables[key];
  }
}