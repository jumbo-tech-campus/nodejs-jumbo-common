import IORedis from 'ioredis';
import {RedisClient} from '../../../src/components/redis/RedisClient';
import {RedisGet} from '../../../src/components/redis/RedisGet';

describe('A RedisGet', () => {
  const ReplyError       = require('ioredis').ReplyError;
  const clientMock       = {} as IORedis.Redis;
  const redisMock        = {
    client: clientMock,
  } as RedisClient;
  const redisGet         = new RedisGet(redisMock, '');
  const successfulResult = {property: ''};
  const jsonString       = JSON.stringify({property: ''});

  describe('Receiving a successful Redis query', () => {
    let result: any;
    beforeEach(async () => {
      clientMock.get         = () => Promise.resolve(jsonString);

      result = await redisGet.execute();
    });

    it('Returns a parsed object', async () => {
      expect(result).toEqual(successfulResult);
    });
  });

  describe('Receiving a Not Found Redis query', () => {
    let result: any;

    beforeEach(async () => {
      // tslint:disable-next-line:no-null-keyword
      clientMock.get = () => Promise.resolve(null);
      result         = await redisGet.execute();
    });

    it('Returns void 0', async () => {
      expect(result).toEqual(void 0);
    });
  });

  describe('Receiving a failed Redis query', () => {
    let error: Error;

    beforeEach(async () => {
      clientMock.get = () => Promise.reject(new ReplyError());

      try {
        await redisGet.execute();
      } catch (e) {
        error = e;
      }
    });

    it('Returns a Redis ReplyError', async () => {
      expect(error).toEqual(jasmine.any(ReplyError));
    });
  });
});
