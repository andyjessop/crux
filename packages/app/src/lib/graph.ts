import { CruxContext } from "./app";

type ModulesDeps = Record<string, string[]>;
type ServicesDeps = Record<string, string[]>;

/**
 * For each module, we want to be able to retrieve an array of dependencies in
 * the order in which they should be instantiated. e.g.
 * 
 * modules: {
 *   downstream: ['upstream.service2'],
 *   upstream: ['service1'],
 * },
 * services: {
 *   service1: []
 * }
 * 
 * Produces:
 * 
 * {
 *   upstream: [{ name: 'service1', type: 'service' }],
 *   downstream: [
 *     { name: 'service1', type: 'service' },
 *     { name: 'upstream', type: 'module' },
 *     { name: 'upstream.service2', type: 'service' }]
 * }
*/
export function createGraph(modules: ModulesDeps, services: ServicesDeps) {
  //
}

interface ResolverEntry {
  factory: () => Promise<any>;
  deps: Array<{
    name: string;
    type: 'module' | 'service';
  }>;
}

type ResolverConfig = Record<string, ResolverEntry[]>;

/**
 * The resolver manages instances of modules and services.
 */
export function createResolver(config: ResolverConfig, ctx: CruxContext) {
  //
}