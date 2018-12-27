import * as Logger from 'bunyan';
import {Measurable} from './Measurable';
import {AsyncMeasurer} from './AsyncMeasurer';

export class AsyncTelemetry<T> {
  private readonly measurable: Measurable<T>;
  private readonly logger: Logger;
  private readonly measurer: AsyncMeasurer;
  private readonly defaultStatsDTags?: string[];

  public constructor(logger: Logger,
                     query: Measurable<T>,
                     measurer: AsyncMeasurer,
                     defaultStatsDTags?: string[]) {
    this.logger            = logger;
    this.measurer          = measurer;
    this.measurable        = query;
    this.defaultStatsDTags = defaultStatsDTags;
  }

  public async execute(): Promise<T> {
    try {
      return await this.measurer.measure(this.measurable, this.defaultStatsDTags);
    } catch (error) {
      this.logger.error({
        objectName: this.measurable.name,
        options:    this.measurable.options,
        error:      error,
      }, `Error while doing ${this.measurable.type}`);

      throw error;
    }
  }
}