import {StatsD} from 'hot-shots';
import {Measurable} from './Measurable';

export class AsyncMeasurer {
  private readonly statsD: StatsD;

  public constructor(statsD: StatsD) {
    this.statsD = statsD;
  }

  public async measure<T>(measureable: Measurable<T>, defaultTags: string[] = []): Promise<T> {
    const before = Date.now();

    try {
      const result = await measureable.execute();

      this.statsD.timing(
        `${measureable.measurePrefix}duration`,
        Date.now() - before,
        defaultTags.concat(measureable.tags, 'result:success'));

      return result;
    } catch (error) {
      this.statsD.timing(
        `${measureable.measurePrefix}duration`,
        Date.now() - before,
        defaultTags.concat(measureable.tags, 'result:failed'));

      throw error;
    }
  }
}