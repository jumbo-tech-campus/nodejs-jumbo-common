/* istanbul ignore file */
import * as hapi from 'hapi';
import Boom from 'boom';
import * as Logger from 'bunyan';
import {StatsD} from 'hot-shots';
import * as vision from 'vision';
import * as inert from 'inert';
import {hapiRequestMeasurer} from './hapiRequestMeasurer';

const hapiSwagger = require('hapi-swagger');

export interface HapiConfiguration {
  fqdn: string;
  server: string;
  port: string;
  validationErrorWithDescription: boolean;
  baseURL: string;
  appName: string;
  appVersion: string;
}

export class HapiWrapper {
  private readonly server: hapi.Server;
  private readonly logger: Logger;
  private readonly statsD: StatsD;
  private readonly config: HapiConfiguration;

  public constructor(logger: Logger, statsD: StatsD, config: HapiConfiguration) {
    this.logger = logger;
    this.statsD = statsD;
    this.config = config;
    this.server = this.createServer();
  }

  public async start(): Promise<hapi.Server> {
    await this.registerDefaultPlugins();

    try {
      await this.server.start();
    } catch (error) {
      this.logger.error({
        error: error,
      }, 'Error starting Hapi');

      throw error;
    }

    this.logger.info({
      host: this.config.server,
      port: this.config.port,
    }, 'Service started');

    return this.server;
  }

  private createServer(): hapi.Server {
    return new hapi.Server({
      address: this.config.server,
      port:    this.config.port,
      routes:  {
        validate: {
          failAction: async (request, h, err) => {
            this.logger.warn({
              request: {
                path:    request.path,
                method:  request.method,
                headers: request.headers,
                query:   request.query,
                payload: request.payload,
              },
              error:   err,
            }, 'Bad Request');
            if (this.config.validationErrorWithDescription) {
              throw err;
            }

            throw Boom.badRequest('Invalid request payload input');
          },
        },
      },
    });
  }

  private async registerDefaultPlugins(): Promise<void> {
    await this.server.register([
      {
        plugin:  hapiSwagger,
        options: {
          info:              {
            'title':   this.config.appName,
            'version': this.config.appVersion,
          },
          host:              this.config.fqdn,
          jsonPath:          `${this.config.baseURL}/swagger.json`,
          documentationPath: `${this.config.baseURL}/documentation`,
          swaggerUIPath:     `${this.config.baseURL}/swaggerui/`,
        },
      },
      {
        plugin:  hapiRequestMeasurer,
        options: {
          statsdClient: this.statsD,
        },
      },
    ]);

    await this.server.register([inert, vision]);
  }
}