export interface Cacheable<T> {
  cacheKey: string;
  execute: () => Promise<T>;
}