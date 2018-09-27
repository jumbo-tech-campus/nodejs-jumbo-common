import * as Logger from 'bunyan';

export const createLogger = (name: string, logLevel: Logger.LogLevel) => Logger.createLogger({
  name:        name,
  level:       logLevel,
  serializers: {
    error: Logger.stdSerializers.err,
  },
});