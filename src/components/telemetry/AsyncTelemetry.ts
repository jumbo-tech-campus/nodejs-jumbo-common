import * as Logger from 'bunyan';
import {Measurable} from './Measurable';
import {AsyncMeasurer} from './AsyncMeasurer';

export class AsyncTelemetry<T> {
  private readonly logger: Logger;
  private readonly measurer: AsyncMeasurer;

  public constructor(logger: Logger,
                     measurer: AsyncMeasurer) {
    this.logger            = logger;
    this.measurer          = measurer;
  }

  public async execute(measurable: Measurable<T>,
                       defaultStatsDTags?: string[]): Promise<T> {
    try {
      return await this.measurer.measure(measurable, defaultStatsDTags);
    } catch (error) {
      this.logger.error({
        objectName: measurable.name,
        options:    measurable.options,
        error:      error,
      }, `Error while doing ${measurable.type}`);

      throw error;
    }
  }
}