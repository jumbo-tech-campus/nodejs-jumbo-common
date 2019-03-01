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
    const {error, value} = joi.validate(data, this.schema);
    if (error) {
      this.logger.error({
        data:  data,
        error: error,
      }, 'Data Validation Error');

      this.statsD.increment('data_validation_error');

      throw error;
    }

    return value as T;
  }
}