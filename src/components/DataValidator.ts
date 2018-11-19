import joi from 'joi';

export class DataValidator {
  private readonly schema: joi.Schema;

  public constructor(schema: joi.Schema) {
    this.schema = schema;
  }

  public async validate(data: unknown): Promise<void> {
    await joi.validate(data, this.schema);
  }
}