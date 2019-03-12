import {CacheQuery} from './CacheQuery';
import {Measurable} from '../telemetry/Measurable';

export class MeasurableCacheQuery<T> implements CacheQuery<T>, Measurable<T> {
  public readonly type: string                                    = 'CacheQuery';
  private result: 'success' | 'failed' | 'notexecuted' | 'nodata' = 'notexecuted';
  private readonly query: CacheQuery<T>;

  public constructor(query: CacheQuery<T>) {
    this.query = query;
  }

  public get name(): string {
    return this.query.constructor.name;
  }

  public get options(): object {
    return {};
  }

  public get tags(): string[] {
    return [
      `result:${this.result}`,
      `type:${this.name}`,
    ];
  }

  public async execute(): Promise<T> {
    try {
      const result = await this.query.execute();

      this.result = 'success';

      if (!result) {
        this.result = 'nodata';
      }

      return result;
    } catch (error) {
      this.result = 'failed';

      throw error;
    }
  }
}