import {MongoCreate} from './MongoCreate';
import {MongoFindOne} from './MongoFindOne';
import {MongoQuery} from './MongoQuery';
import mongoose from 'mongoose';

export interface MongoFindOrCreateResult<T> {
  created: boolean;
  document: T;
}

export class MongoFindOrCreate<T extends mongoose.Document> implements MongoQuery<MongoFindOrCreateResult<T>> {
  private readonly findOneQuery: MongoFindOne<T>;
  private readonly createQuery: MongoCreate<T>;

  public constructor(findOneQuery: MongoFindOne<T>, createQuery: MongoCreate<T>) {
    this.findOneQuery = findOneQuery;
    this.createQuery  = createQuery;
  }

  public get options(): object {
    return this.findOneQuery.options;
  }

  public async execute(): Promise<MongoFindOrCreateResult<T>> {
    const document = await this.findOneQuery.execute();
    if (!document) {
      return {
        created:  true,
        document: await this.createQuery.execute(),
      };
    }

    return {
      created:  false,
      document: document,
    };
  }
}