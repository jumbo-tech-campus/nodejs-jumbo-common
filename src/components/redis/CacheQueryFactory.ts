import {CacheQuery} from './CacheQuery';
import {CacheInsertOptions} from './CacheInsertOptions';

export interface CacheQueryFactory {
  createGet(id: string): CacheQuery<any>;
  createGetMultiple(ids: string[]): CacheQuery<Record<string, any>>;
  createInsert(id: string, document: any, options?: CacheInsertOptions): CacheQuery<void>;
}