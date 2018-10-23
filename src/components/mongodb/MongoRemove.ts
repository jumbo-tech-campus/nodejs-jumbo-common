import * as mongoose from 'mongoose';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';
import {MongoQuery} from './MongoQuery';

export class MongoRemove<T extends mongoose.Document> implements Measurable<void>, MongoQuery<void> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.measurePrefix = 'mongodb.delete.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public async execute(): Promise<void> {
    await this.model.findOneAndRemove(this.options).exec();
  }
}