export interface Cache {
  clear(): void;
  get(key: string): unknown | null;
  remove(key: string): void;
  set(key: string, value: unknown): void;
}

export interface AsyncCache {
  get(key: string): Promise<unknown>;
  remove(key: string): Promise<void>;
  set(key: string, value: unknown): Promise<void>;
}
