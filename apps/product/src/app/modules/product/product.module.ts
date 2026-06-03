import { TypeOrmProvider } from '@common/configuration/lib/type-orm.config';
import { Product } from '@common/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  exports: [],
  controllers: [],
  providers: [],
})
export class ProductModule {}
