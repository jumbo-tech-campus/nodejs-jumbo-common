import * as Logger from 'bunyan';

export const loggerMock = {} as Logger;
loggerMock.info         = () => undefined as any;
loggerMock.warn         = () => undefined as any;
loggerMock.error        = () => undefined as any;
loggerMock.child        = () => loggerMock;