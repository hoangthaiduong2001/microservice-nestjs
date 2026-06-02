import { TypeOrmProvider } from '@common/configuration/lib/type-orm.config';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmProvider],
  exports: [],
  controllers: [],
  providers: [],
})
export class ProductModule {}
