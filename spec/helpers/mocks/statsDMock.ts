import {StatsD} from 'hot-shots';

export const statsDMock = {} as StatsD;
statsDMock.timing       = () => void 0;
statsDMock.increment    = () => void 0;