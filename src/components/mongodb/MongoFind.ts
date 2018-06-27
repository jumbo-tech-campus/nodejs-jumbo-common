import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';
import {ModelPopulateOptions} from 'mongoose';

export class MongoFind<T extends mongoose.Document> implements Measurable<T[]>, MongoQuery<T[]> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;
  private readonly currentOptions: {
    populate?: ModelPopulateOptions | ModelPopulateOptions[];
    projection?: any;
  };

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]) {
    this.options        = findOptions;
    this.measurePrefix  = 'mongodb.find.';
    this.model          = model;
    this.currentOptions = {populate};
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<T[]> {
    let query = this.model.find(this.options, this.currentOptions.projection);

    if (this.currentOptions.populate) {
      query = query.populate(this.currentOptions.populate);
    }

    return query.exec();
  }
}