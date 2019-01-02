import joi from 'joi';
import * as Logger from 'bunyan';
import {StatsD} from 'hot-shots';

export class DataValidator<T = any> {
  private readonly logger: Logger;
  private readonly statsD: StatsD;
  private readonly schema: joi.Schema;

  public constructor(logger: Logger, statsD: StatsD, schema: joi.Schema) {
    this.schema = schema;
    this.statsD = statsD;
    this.logger = logger;
  }

  public validate(data: unknown): T {
    const result = this.schema.validate(data);
    if (result.error) {
      this.logger.error({
        data:  data,
        error: result.error,
      }, 'Data Validation Error');

      this.statsD.increment('data_validation_error');

      throw result.error;
    }

    return data as T;
  }
}