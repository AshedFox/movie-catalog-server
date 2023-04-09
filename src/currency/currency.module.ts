import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from './entities/currency.entity';
import { CurrencyResolver } from './currency.resolver';
import { CurrencyService } from './currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity])],
  providers: [CurrencyResolver, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
