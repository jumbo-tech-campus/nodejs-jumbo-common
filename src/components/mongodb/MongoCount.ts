import * as mongoose from 'mongoose';
import {objectToTags} from '../statsd/objectToTags';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';

export class MongoCount<T extends mongoose.Document> implements MongoQuery<number>, Measurable<number> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>) {
    this.options       = findOptions;
    this.measurePrefix = 'mongodb.count.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<number> {
    return this.model.countDocuments(this.options).exec();
  }
}