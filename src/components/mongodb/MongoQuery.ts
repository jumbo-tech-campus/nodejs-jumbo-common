export interface MongoQuery<T> {
  execute(): Promise<T>;
}