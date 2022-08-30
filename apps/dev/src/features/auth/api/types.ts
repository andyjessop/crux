export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface User {
  id: string;
  confirmation_sent_at?: string; // new Date()).toISOString()
  email: string;
  role: string;
  user_metadata: Record<string, any>;
}