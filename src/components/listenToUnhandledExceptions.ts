/* istanbul ignore file */
import Logger from 'bunyan';

export const listenToUnhandledExceptions = (logger: Logger): void => {
  process.on('unhandledRejection', (reason, p) => {
    throw reason;
  });

  process.on('uncaughtException', (err) => {
    logger.error({error: err}, 'Unhandled Exception');

    setTimeout(() => process.exit(1), 50);
  });
};
