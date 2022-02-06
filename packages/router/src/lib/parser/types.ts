export interface SearchParams {
  entries(): [string, any];
  get(name: string): string | null;
  keys(): string[];
}