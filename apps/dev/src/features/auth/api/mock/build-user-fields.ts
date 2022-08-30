import { generateRandomId } from "@crux/string-utils";

export function buildUserFields(email: string) {
  return {
    "id": generateRandomId(),
    "role": "authenticated",
    "email": email,
    "user_metadata": {},
  };
}