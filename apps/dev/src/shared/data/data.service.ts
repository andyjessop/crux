import { query } from "@crux/query";
import { service } from "@crux/xapp";

export function data() {
  return query('data');
}