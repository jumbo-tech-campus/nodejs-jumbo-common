import joi from 'joi';
import * as Logger from 'bunyan';

export class DataValidator {
  private readonly logger: Logger;
  private readonly schema: joi.Schema;

  public constructor(logger: Logger, schema: joi.Schema) {
    this.schema = schema;
    this.logger = logger;
  }

  public async validate(data: unknown): Promise<void> {
    try {
      await joi.validate(data, this.schema);
    } catch (error) {
      this.logger.error({
        data:  data,
        error: error,
      }, 'Data Validation Error');

      throw error;
    }
  }
}