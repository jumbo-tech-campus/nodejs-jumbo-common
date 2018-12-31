import {startStatsD} from '../../../src/components/telemetry/startStatsD';
import * as Logger from 'bunyan';
import {StatsD} from 'hot-shots';

describe('A startStatsD', () => {
  it('Can start statsD', () => {
    expect(startStatsD({} as Logger, 'localhost', 5105, 'test.prefix.') instanceof StatsD).toEqual(true);
  });
});