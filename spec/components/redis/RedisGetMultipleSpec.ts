import IORedis from 'ioredis';
import {RedisClient} from '../../../src/components/redis/RedisClient';
import {RedisGetMultiple} from '../../../src/components/redis/RedisGetMultiple';

describe('A RedisGetMultiple', () => {
  const ReplyError = require('ioredis').ReplyError;
  const clientMock = {} as IORedis.Redis;
  const redisMock = {
    client: clientMock,
  } as RedisClient;
  let redisGetMultiple: RedisGetMultiple<any>;
  const successfulResult = {
    id1: {value: {test: 'test'}},
    id2: {value: {test: 'test'}},
  };
  const mgetResult = [JSON.stringify(successfulResult.id1), JSON.stringify(successfulResult.id2)];

  describe('Instantiated with query keys', () => {
    let result: any;

    beforeEach(async () => {
      clientMock.mget = () => Promise.resolve(mgetResult);

      redisGetMultiple = new RedisGetMultiple(redisMock, ['id1', 'id2']);
      result = await redisGetMultiple.execute();
    });

    it('Returns parsed objects', async () => {
      expect(result).toEqual(successfulResult);
    });
  });

  describe('Instantiated without query keys', () => {
    let result: any;

    beforeEach(async () => {
      clientMock.mget = () => Promise.resolve(mgetResult);

      redisGetMultiple = new RedisGetMultiple(redisMock, []);
      result = await redisGetMultiple.execute();
    });

    it('Returns an empty object', async () => {
      expect(result).toEqual({});
    });
  });

  describe('Receiving unfound query results', () => {
    const halfSuccessfulResult = {id2: {value: {test: 'test'}}};
    let result: any;

    beforeEach(async () => {
      // tslint:disable-next-line:no-null-keyword
      const mgetResult = [null, JSON.stringify({value: {test: 'test'}})];
      clientMock.mget = () => Promise.resolve(mgetResult);
      const redisMock = {
        client: clientMock,
      } as RedisClient;
      redisGetMultiple = new RedisGetMultiple(redisMock, ['unexistent', 'id2']);
      result = await redisGetMultiple.execute();
    });

    it('Returns a filtered object', async () => {
      expect(result).toEqual(halfSuccessfulResult);
    });
  });

  describe('Receiving a failed query result', () => {
    let error: Error;

    beforeEach(async () => {
      redisGetMultiple = new RedisGetMultiple(redisMock, ['id1', 'id2']);
      clientMock.mget = () => Promise.reject(new ReplyError());

      try {
        await redisGetMultiple.execute();
      } catch (e) {
        error = e;
      }
    });

    it('Returns a Redis ReplyError', async () => {
      expect(error).toEqual(jasmine.any(ReplyError));
    });
  });
});
