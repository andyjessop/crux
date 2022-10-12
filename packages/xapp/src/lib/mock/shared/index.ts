import { service } from "../../service";

export const sharedService = service(() => import('./service').then(mod => mod.sharedService()));