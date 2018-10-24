import {MongoCreate} from './MongoCreate';
import {MongoFindOne} from './MongoFindOne';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import mongoose from 'mongoose';
import {objectToTags} from '../statsd/objectToTags';

export class MongoFindOrCreate<T extends mongoose.Document> implements Measurable<T>, MongoQuery<T> {
  public readonly measurePrefix: string;
  private readonly findOneQuery: MongoFindOne<T>;
  private readonly createQuery: MongoCreate<T>;

  public constructor(findOneQuery: MongoFindOne<T>, createQuery: MongoCreate<T>) {
    this.findOneQuery = findOneQuery;
    this.createQuery = createQuery;
    this.measurePrefix = 'mongodb.findorcreate.';
  }

  public get tags(): string[] {
    return objectToTags(this.findOneQuery.options);
  }

  public get options(): object {
    return this.findOneQuery.options;
  }

  public async execute(): Promise<T> {
    let document = await this.findOneQuery.execute();
    if (!document) {
      document = await this.createQuery.execute();
    }

    return document;
  }
}