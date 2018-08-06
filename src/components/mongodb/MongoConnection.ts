import mongoose from 'mongoose';
import * as Logger from 'bunyan';

interface MongoConnectionConfig {
  mongoURL: string;
  mongoUser: string;
  mongoPass: string;
  mongoDBName: string;
  mongoAuthDB?: string;
}

export class MongoConnection {
  private readonly logger: Logger;
  private readonly config: MongoConnectionConfig;

  public constructor(logger: Logger, config: MongoConnectionConfig) {
    this.logger = logger;
    this.config = config;
  }

  public async connect(): Promise<mongoose.Mongoose> {
    let mongooseConnection: mongoose.Mongoose;
    let mongooseOptions = {
      user:   this.config.mongoUser,
      pass:   this.config.mongoPass,
      dbName: this.config.mongoDBName,
      auth:   {
        authdb: this.config.mongoAuthDB,
      },
      server: {
        auto_reconnect: true
      },
    };

    mongoose.connection.on('error', (err) => {
      this.logger.error({
        error: err,
      }, 'Mongoose connection error');
      mongoose.disconnect();
    });

    mongoose.connection.on('connected', () => {
      this.logger.info({
        mongoURL: this.config.mongoURL,
      }, 'Mongoose connected');
    });

    mongoose.connection.on('reconnected', () => {
      this.logger.info({
        mongoURL: this.config.mongoURL,
      }, 'Mongoose reconnected');
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.info({}, 'Mongoose disconnected');
      mongoose.connect(this.config.mongoURL, mongooseOptions);
    });

    mongoose.connect(this.config.mongoURL, mongooseOptions);

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        this.logger.info({}, 'Disconnect Mongoose through app termination');

        process.exit(0);
      });
    });

    return mongooseConnection;
  }
}
