import {RedisClient} from '../../../src/components/redis/RedisClient';
import {RedisQueryFactory} from '../../../src/components/redis/RedisQueryFactory';
import {CacheQueryTelemetry} from '../../../src/components/redis/CacheQueryTelemetry';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';

describe('A CacheQueryFactory', () => {
  const couchbaseMock      = {} as RedisClient;
  const asyncTelemetryMock = {} as AsyncTelemetry;

  const queryFactory = new RedisQueryFactory(couchbaseMock, asyncTelemetryMock);

  it('Can return a Get query instance', () => {
    expect(queryFactory.createGet('id') instanceof CacheQueryTelemetry).toEqual(true);
  });

  it('Can return a GetMultiple query instance', () => {
    expect(queryFactory.createGetMultiple(['id1', 'id2']) instanceof CacheQueryTelemetry).toEqual(true);
  });

  it('Can return a Insert query instance', () => {
    expect(queryFactory.createInsert('id1', {}) instanceof CacheQueryTelemetry).toEqual(true);
  });
});
