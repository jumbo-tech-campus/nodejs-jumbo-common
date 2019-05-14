import IORedis from 'ioredis';
import {RedisClient} from '../../../src/components/redis/RedisClient';
import {CacheInsertOptions} from '../../../src/components/redis/CacheInsertOptions';
import {RedisInsert} from '../../../src/components/redis/RedisInsert';

describe('A RedisGet', () => {
  const ReplyError = require('ioredis').ReplyError;
  const clientMock = {} as IORedis.Redis;
  const redisMock  = {
    client: clientMock,
  } as RedisClient;
  let redisInsert: RedisInsert;

  describe('With CacheInsertOptions', () => {
    let result: any;

    beforeEach(async () => {
      clientMock.multi = () => clientMock as any;
      clientMock.set   = () => clientMock as any;
      clientMock.exec  = () => Promise.resolve();

      redisInsert = new RedisInsert(redisMock, '', {property: ''}, {} as CacheInsertOptions);

      result = await redisInsert.execute();
    });

    it('Inserts without error', async () => {
      expect(result).toEqual(void 0);
    });
  });

  describe('Without CacheInsertOptions', () => {
    let result: any;

    beforeEach(async () => {
      clientMock.multi = () => clientMock as any;
      clientMock.exec  = () => Promise.resolve();
      clientMock.set   = () => clientMock as any;

      redisInsert = new RedisInsert(redisMock, '', {});
      result      = await redisInsert.execute();
    });

    it('Inserts without error', async () => {
      expect(result).toEqual(void 0);
    });
  });

  describe('Receiving a failed Redis query', () => {
    let error: Error;

    beforeEach(async () => {
      clientMock.multi = () => clientMock as any;
      clientMock.exec  = () => Promise.resolve();
      clientMock.set   = () => clientMock as any;

      redisInsert = new RedisInsert(redisMock, '', {property: ''}, {} as CacheInsertOptions);

      clientMock.exec = () => Promise.reject(new ReplyError());

      try {
        await redisInsert.execute();
      } catch (e) {
        error = e;
      }
    });

    it('Returns a Redis ReplyError', async () => {
      expect(error).toEqual(jasmine.any(ReplyError));
    });
  });
});