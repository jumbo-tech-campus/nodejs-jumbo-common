import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';

export class MongoFindOne<T extends mongoose.Document> implements Measurable<T | null>, MongoQuery<T | null> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.measurePrefix = 'mongodb.findone.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public async execute(): Promise<T | null> {
    return await this.model.findOne(this.options).exec();
  }
}