import * as Logger from 'bunyan';
import IORedis, {RedisOptions} from 'ioredis';

interface RedisConfig {
  host: string;
  port: number;
  tlsEnabled: boolean;
  secret: string;
}

export class RedisClient {
  private logger: Logger;
  private config: RedisConfig;
  private _client: IORedis.Redis;

  public constructor(logger: Logger, redisConfig: RedisConfig) {
    this.logger  = logger;
    this.config  = redisConfig;
    this._client = this.createRedisClient();

    this.addClientListeners();
  }

  public get client(): IORedis.Redis {
    return this._client;
  }

  public get connected(): boolean {
    return this.client.status === 'connect';
  }

  private createRedisClient(): IORedis.Redis {
    const options: RedisOptions = {
      host:     this.config.host,
      port:     this.config.port,
      password: this.config.secret,
    };

    if (this.config.tlsEnabled) {
      options.tls = {};
    }

    return new IORedis(options);
  }

  private addClientListeners(): void {
    this._client.on('connect', () => {
      this.logger.info('Connection established to the Redis server');
    });

    this._client.on('ready', () => {
      this.logger.info('Redis cluster is able to receive commands');
    });

    this._client.on('reconnecting', (secondsBeforeReconnecting: number) => {
      this.logger.warn(`${secondsBeforeReconnecting} seconds before reconnecting to Redis server`);
    });

    this._client.on('error', (error) => {
      this.logger.fatal({
          error: error,
        },
        `Redis connection error`);
    });
  }
}