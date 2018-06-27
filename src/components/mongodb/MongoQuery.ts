export interface MongoQuery<T> {
  readonly options: {[key: string]: any};

  execute(): Promise<T>;
}