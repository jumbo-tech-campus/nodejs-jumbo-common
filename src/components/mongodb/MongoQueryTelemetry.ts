import {MongoQuery} from './MongoQuery';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import {Measurable} from '../telemetry/Measurable';

export class MongoQueryTelemetry<T> implements MongoQuery<T> {
  private readonly asyncTelemetry: AsyncTelemetry;
  private readonly query: MongoQuery<T> & Measurable<T>;

  public constructor(asyncTelemetry: AsyncTelemetry, query: MongoQuery<T> & Measurable<T>) {
    this.asyncTelemetry = asyncTelemetry;
    this.query = query;
  }

  public get options(): object {
    return this.query.options;
  }

  public async execute(): Promise<T> {
    return this.asyncTelemetry.execute(this.query);
  }
}