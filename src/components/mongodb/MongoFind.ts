import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';

export class MongoFind<T extends mongoose.Document> implements Measurable<T[]>, MongoQuery<T[]> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>) {
    this.options       = findOptions;
    this.measurePrefix = 'mongodb.find.';
    this.model         = model;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public async execute(): Promise<T[]> {
    return await this.model.find(this.options).exec();
  }
}