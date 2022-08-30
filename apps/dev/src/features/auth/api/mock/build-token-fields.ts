import { generateRandomId } from "@crux/string-utils";

export function buildTokenFields() {
  return {
    "access_token": generateRandomId(),
    "token_type": "bearer",
    "expires_in": 604800,
    "refresh_token": generateRandomId(),
  }
}