import {StatsD} from 'hot-shots';
import {Measurable} from './Measurable';

export class AsyncMeasurer {
  private readonly statsD: StatsD;

  public constructor(statsD: StatsD) {
    this.statsD = statsD;
  }

  public async measure<T>(measureable: Measurable<T>, defaultTags: string[] = []): Promise<T> {
    const before = Date.now();

    let result: T;

    try {
      result = await measureable.execute();
    } catch (error) {
      this.statsD.timing(
        `${measureable.measurePrefix}duration`,
        Date.now() - before,
        defaultTags.concat(measureable.tags));

      throw error;
    }

    this.statsD.timing(
      `${measureable.measurePrefix}duration`,
      Date.now() - before,
      defaultTags.concat(measureable.tags));

    return result;
  }
}