import { Collection, Model } from './di';

export function getDependents<T>(name: keyof T, services: Collection<T>) {
  return Object.values(services)
    .filter((service) => (<Model<T>>service).dependencies.includes(name))
    .map((service) => (<Model<T>>service).name);
}
