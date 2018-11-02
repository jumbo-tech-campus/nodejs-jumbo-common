import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';

export class MongoMeasurable<T> implements MongoQuery<T>, Measurable<T> {
  public readonly measurePrefix: string = 'mongodb.';
  private readonly mongoQuery: MongoQuery<T>;

  public constructor(mongoQuery: MongoQuery<T>) {
    this.mongoQuery = mongoQuery;
  }

  public get options(): object {
    return this.mongoQuery.options;
  }

  public get tags(): string[] {
    return [
      `type:${this.mongoQuery.constructor.name}`,
    ];
  }

  public async execute(): Promise<T> {
    return await this.mongoQuery.execute();
  }
}