export interface MongoQuery<T> {
  readonly options: object;

  execute(): Promise<T>;
}