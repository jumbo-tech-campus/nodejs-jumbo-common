import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';

describe('A MongoQueryTelemetry', () => {
  const asyncTelemetry  = {} as AsyncTelemetry<any>;
  const mockResult: any = {};

  const mongoQueryMeasurer = new MongoQueryTelemetry(asyncTelemetry);

  beforeEach(() => {
    asyncTelemetry.execute = () => Promise.resolve(mockResult);
  });

  it('Should be able to measure a MongoQuery', async () => {
    const result = await mongoQueryMeasurer.execute();

    expect(result).toEqual(mockResult);
  });

  it('Should log an error', async () => {
    const throwError       = new Error('Error');
    asyncTelemetry.execute = () => Promise.reject(throwError);

    try {
      await mongoQueryMeasurer.execute();
    } catch (error) {
      expect(error).toBe(throwError);

      return;
    }

    fail();
  });
});