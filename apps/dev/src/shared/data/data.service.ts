import { query } from "@crux/query";
import { service } from "@crux/xapp";

export const dataService = service(() => query('data'));