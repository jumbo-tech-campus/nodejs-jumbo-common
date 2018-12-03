import joi from 'joi';
import * as Logger from 'bunyan';

export class DataValidator<T = any> {
  private readonly logger: Logger;
  private readonly schema: joi.Schema;

  public constructor(logger: Logger, schema: joi.Schema) {
    this.schema = schema;
    this.logger = logger;
  }

  public validate(data: unknown): data is T {
    const result = this.schema.validate(data);
    if (result.error) {
      this.logger.error({
        data:  data,
        error: result.error,
      }, 'Data Validation Error');

      throw result.error;
    }

    return true;
  }
}