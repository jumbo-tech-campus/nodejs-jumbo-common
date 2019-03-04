import {RedisClient} from '../../../src/components/redis/RedisClient';
import {AsyncMeasurer} from '../../../src/components/telemetry/AsyncMeasurer';
import {RedisQueryFactory} from '../../../src/components/redis/RedisQueryFactory';
import {loggerMock} from '../../helpers/mocks/loggerMock';
import {CacheQueryTelemetry} from '../../../src/components/redis/CacheQueryTelemetry';

describe('A CacheQueryFactory', () => {
  const couchbaseMock = {} as RedisClient;
  const measurer      = {} as AsyncMeasurer;

  const queryFactory = new RedisQueryFactory(couchbaseMock, loggerMock, measurer);

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
