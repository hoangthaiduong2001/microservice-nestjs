import { AppConfiguration } from '@common/configuration/lib/app.config';
import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { GrpcConfiguration } from '@common/configuration/lib/grpc.config';
import { MongoConfiguration } from '@common/configuration/lib/mongo.config';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV: TcpConfiguration = new TcpConfiguration();

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGO_CONFIG: MongoConfiguration = new MongoConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV: GrpcConfiguration = new GrpcConfiguration();
}

export const CONFIGURATION = new Configuration();

export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
