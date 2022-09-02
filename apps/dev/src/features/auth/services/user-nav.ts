import type { User } from "../api/types";



export interface LoginFormActions {
  cancelLogin(): void;
  submitLoginForm(email: string, password: string): Promise<void>;
}

export interface SignupFormActions {
  cancelSignup(): void;
  submitSignupForm(email: string, password: string): Promise<void>;
}