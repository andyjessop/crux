import type { User } from "../api/types";

export interface UserNavData {
  user: User | null;
}

export interface UserNavActions {
  clickLogin(): void;
  clickSignup(): void;
}

export interface LoginFormActions {
  cancelLogin(): void;
  submitLoginForm(email: string, password: string): Promise<void>;
}

export interface SignupFormActions {
  cancelSignup(): void;
  submitSignupForm(email: string, password: string): Promise<void>;
}