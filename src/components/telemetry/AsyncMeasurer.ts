import {StatsD} from 'hot-shots';
import {Measurable} from './Measurable';

export class AsyncMeasurer {
  private readonly statsD: StatsD;

  public constructor(statsD: StatsD) {
    this.statsD = statsD;
  }

  public async measure<T>(measurable: Measurable<T>, defaultTags: string[] = []): Promise<T> {
    const before = Date.now();

    let result: T;

    try {
      result = await measurable.execute();
    } catch (error) {
      this.statsD.timing(
        `${measurable.type.toLowerCase()}.duration`,
        Date.now() - before,
        defaultTags.concat(measurable.tags));

      throw error;
    }

    this.statsD.timing(
      `${measurable.type.toLowerCase()}.duration`,
      Date.now() - before,
      defaultTags.concat(measurable.tags));

    return result;
  }
}