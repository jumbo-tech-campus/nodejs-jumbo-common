import {CacheQuery} from './CacheQuery';
import {Measurable} from '../telemetry/Measurable';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

export class CacheQueryTelemetry<T> implements CacheQuery<T> {
  private readonly query: CacheQuery<T> & Measurable<T>;
  private readonly asyncTelemetry: AsyncTelemetry;
  private readonly defaultStatsDTags?: string[];

  public constructor(query: CacheQuery<T> & Measurable<T>,
                     asyncTelemetry: AsyncTelemetry,
                     defaultStatsDTags?: string[]) {
    this.asyncTelemetry    = asyncTelemetry;
    this.query             = query;
    this.defaultStatsDTags = defaultStatsDTags;
  }

  public async execute(): Promise<T> {
    return await this.asyncTelemetry.execute(this.query, this.defaultStatsDTags);
  }
}