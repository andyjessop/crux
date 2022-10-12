import { createExternallyResolvablePromise } from "@crux/utils";

interface ResolverEntry {
  factory: () => Promise<(...args: any[]) => any>;
  deps?: Array<string>;
}

type ResolverConfig = Record<string, ResolverEntry>;

/**
 * The resolver manages instances of modules and services.
 */
export function createResolver(services: ResolverConfig, modules: ResolverConfig) {
  const configs = {
    ...services,
    ...Object.entries(modules).reduce((acc, [moduleName, moduleConfig]) => {      
      if (!moduleConfig.deps) {
        moduleConfig.deps = [];
      }

      const deps = moduleConfig.deps as string[];
      const formattedDeps = [] as string[];

      (deps as string[]).forEach(dep => {
        const parts = (dep as string).split('.');

        if (parts.length > 1) {
          const [depModName, depModService] = parts;

          formattedDeps.unshift(`module-${depModName}.${depModService}`);
          formattedDeps.unshift(`module-${(dep as string).split('.')[0]}`);
        } else {
          formattedDeps.push(dep);
        }
      });

      // eslint-disable-next-line
      // @ts-ignore
      moduleConfig.deps = formattedDeps;

      acc[`module-${moduleName}`] = moduleConfig;

      return acc;
    }, {} as {
      [key: string ]: any
    })
  };

  const instances = {} as Record<string, Promise<any> | undefined>;

  return {
    get,
    getModule,
  };

  async function get(name: string, callback?: (name: string, instance: any) => void) {
    if (instances[name]) {
      return instances[name];
    }

    const { promise, resolve } = createExternallyResolvablePromise();

    instances[name] = promise;

    const parts = name.split('.');

    // This is a special case where a module is relying on the services from another
    // module and it's not yet been resolved.
    if (parts.length > 1) {
      const i = await instances[parts[0]];

      if (i.services) {
        Object.entries(i.services).forEach(([key, value]) => {
          configs[`${parts[0]}.${key}`] = value as ResolverEntry;
        });
      }

      if (i.api) {
        configs[`${parts[0]}.api`] = i.api;
      }
    }

    const deps = [];

    for (const dep of (configs[name].deps || [])) {
      const parts = dep.split('.');

      if (parts.length > 1) {
        // ensure that module is instantiated first
        await get(parts[0], callback);
      }
      
      const instance = await instances[dep] ?? await get(dep, callback);      

      if (dep.startsWith('module-') && dep.split('.').length < 2) {
        continue;
      }

      deps.push(instance);
    }

    const constructorFn = await configs[name].factory();

    const instance = constructorFn(...deps);

    // Register module
    if (name.startsWith('module-')) {
      callback?.(name.slice(7), instances[name]);
    }

    if (instance.services) {
      Object.entries(instance.services).forEach(([key, value]) => {
        configs[`${name}.${key}`] = value as ResolverEntry;
      });
    }

    if (instance.api) {
      configs[`${parts[0]}.api`] = instance.api;
    }

    resolve(instance);

    return instances[name];
  }

  async function getModule(name: string, callback?: (name: string, instance: any) => void) {
    return await get(`module-${name}`, callback);
  }
}