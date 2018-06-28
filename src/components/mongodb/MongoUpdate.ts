import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';

export class MongoUpdate<T extends mongoose.Document> implements Measurable<T | null>, MongoQuery<T | null> {
  public readonly options: Partial<T>;
  public readonly document: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, document: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.document      = document;
    this.measurePrefix = 'mongodb.update.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<T | null> {
    return this.model.findOneAndUpdate(this.options, this.document).exec();
  }
}