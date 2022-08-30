import type { AsyncCache } from "../../../shared/cache/types";
import type { Env } from "../../../shared/env/env.service";
import { Variable } from "../../../shared/env/env.service";
import type { Token, User } from "./types";

export type AuthAPI = ReturnType<typeof createAuthApi>;
export type AuthError = {
  code: number;
  message: string;
} | {
  error: string;
} | false;

export function createAuthApi(cache: AsyncCache, env: Env) {  
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('apiKey', env.get(Variable.VITE_PUBLIC_API_KEY));

  return {
    checkLocalUser,
    login,
    logout,
    refreshToken,
    signUp,
    user,
    verify,
  }

  /** 
   * Checks the existance and validity of a locally cached JWT token.
   * If valid => adds the token to the headers and returns true.
   * If not valid => deletes the token and expiry and returns false.
  */
  async function checkLocalUser() {
    const [
      token, expires 
    ] = await Promise.all([
      cache.get('crux-auth-jwt') as Promise<string | undefined>,
      cache.get('crux-auth-jwt-expiry') as Promise<number | undefined>,
      cache.get('crux-auth-jwt-refresh-token') as Promise<string | undefined>
    ]);

    if (!expires || expires < Date.now()) {
      await Promise.all([
        cache.remove('crux-auth-jwt'),
        cache.remove('crux-auth-jwt-expiry'),
      ]);

      return false;
    }

    headers.set('Authorization', `Bearer ${token}`);

    return true;
  }

  async function login(email: string, password: string) {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/token?grant_type=password`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          email, password,
        })
      });

      return res.json() as Promise<(Token & { user: User } | AuthError)>;
    } catch (e) {
      return false;
    }
  }

  async function logout() {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/logout`, {
        headers,
        method: 'POST',
      });

      return res.json();
    } catch (e) {
      return false;
    }
  }

  async function refreshToken() {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/token?grant_type=refresh_token`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ refresh_token: await cache.get('crux-auth-jwt-refresh-token') as Promise<string | undefined> })
      });

      return res.json() as Promise<(Token & { user: User }) | AuthError>;
    } catch (e) {
      return false;
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/signup`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          email, password,
        })
      });

      return res.json() as Promise<User | AuthError>;
    } catch (e) {
      return false;
    }
  }

  async function user() {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/user`, {
        headers,
        method: 'GET',
      });

      return res.json() as Promise<User | AuthError>;
    } catch (e) {
      return false;
    }
  }

  async function verify(token: string) {
    try {
      const res = await fetch(`${env.get(Variable.VITE_API_BASE_URL)}/auth/v1/verify?token=${token}&type=signup&redirect_to=$${env.get(Variable.VITE_API_SIGNUP_REDIRECT_URL)}`, {
        headers,
        method: 'GET',
      });

      return res.json();
    } catch (e) {
      return false;
    }
  }
}