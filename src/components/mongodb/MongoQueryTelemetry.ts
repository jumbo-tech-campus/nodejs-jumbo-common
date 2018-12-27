import {MongoQuery} from './MongoQuery';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

export class MongoQueryTelemetry<T> implements MongoQuery<T> {
  private readonly asyncTelemetry: AsyncTelemetry<T>;

  public constructor(asyncTelemetry: AsyncTelemetry<T>) {
    this.asyncTelemetry = asyncTelemetry;
  }

  public async execute(): Promise<T> {
    return this.asyncTelemetry.execute();
  }
}