import { MongoProvider } from '@common/configuration/lib/mongo.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), MongoProvider],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
