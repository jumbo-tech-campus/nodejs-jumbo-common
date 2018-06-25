import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';
import {ModelPopulateOptions} from 'mongoose';

export class MongoFindOne<T extends mongoose.Document> implements Measurable<T | null>, MongoQuery<T | null> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;
  private readonly populate?: ModelPopulateOptions | ModelPopulateOptions[];

  public constructor(options: Partial<T>, model: mongoose.Model<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]) {
    this.options       = options;
    this.measurePrefix = 'mongodb.findone.';
    this.model         = model;
    this.populate      = populate;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<T | null> {
    let query = this.model.findOne(this.options);

    if (this.populate) {
      query = query.populate(this.populate);
    }

    return query.exec();
  }
}