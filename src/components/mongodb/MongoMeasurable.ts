import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';

export class MongoMeasurable<T> implements MongoQuery<T>, Measurable<T> {
  public readonly measurePrefix: string = 'mongodb.';
  private readonly mongoQuery: MongoQuery<T>;
  private result: 'success' | 'failed' | 'notexecuted'  = 'notexecuted';

  public constructor(mongoQuery: MongoQuery<T>) {
    this.mongoQuery = mongoQuery;
  }

  public get options(): object {
    return this.mongoQuery.options;
  }

  public get tags(): string[] {
    return [
      `result:${this.result}`,
      `type:${this.mongoQuery.constructor.name}`,
    ];
  }

  public async execute(): Promise<T> {
    try {
      const result = await this.mongoQuery.execute();

      this.result = 'success';

      return result;
    } catch (error) {
      this.result = 'failed';

      throw error;
    }
  }
}