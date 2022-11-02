export interface SearchParams {
  entries(): [string, any];
  get(name: string): string | null;
  keys(): string[];
}

export type RouteParams = Record<string, string | null | string[]>;
