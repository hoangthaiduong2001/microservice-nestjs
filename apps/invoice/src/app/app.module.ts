import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { InvoiceModule } from './module/invoice/invoice.moudle';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), InvoiceModule],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
