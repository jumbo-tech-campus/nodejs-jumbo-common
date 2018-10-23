import * as mongoose from 'mongoose';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';
import {MongoQuery} from './MongoQuery';

export class MongoUpdateMany<T extends mongoose.Document> implements Measurable<void>, MongoQuery<void> {
  public readonly options: Partial<T>;
  public readonly document: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, document: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.document      = document;
    this.measurePrefix = 'mongodb.updatemany.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public async execute(): Promise<void> {
    await this.model.updateMany(this.options, this.document).exec();
  }
}