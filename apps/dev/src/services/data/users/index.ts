import type { API } from "@crux/query";
import type { Users } from "../../api/users";
import { config } from "./config";

export function usersDataService(data: API, users: Users) {
  return data.createResource('users', config(users()));
}