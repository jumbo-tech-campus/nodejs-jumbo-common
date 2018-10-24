import mongoose from 'mongoose';

export interface MongoDocumentQueryOptions {
  populate?: mongoose.ModelPopulateOptions | mongoose.ModelPopulateOptions[];
  projection?: any;
  sort?: Array<[string | 1 | -1]>;
  select?: string;
}

export class MongoDocumentQuery {
  private readonly queryOptions: MongoDocumentQueryOptions;

  public constructor(options?: MongoDocumentQueryOptions) {
    this.queryOptions   = options || {};
  }

  public execute<T, DocType extends mongoose.Document>(query: mongoose.DocumentQuery<T, DocType>): Promise<T> {
    if (this.queryOptions.populate) {
      query = query.populate(this.queryOptions.populate);
    }

    if (this.queryOptions.sort) {
      query = query.sort(this.queryOptions.sort);
    }

    if (this.queryOptions.select) {
      query = query.select(this.queryOptions.select);
    }

    return query.exec();
  }
}