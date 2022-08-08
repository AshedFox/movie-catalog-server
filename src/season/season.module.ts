import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonEntity } from './entities/season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity])],
  providers: [SeasonResolver, SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
