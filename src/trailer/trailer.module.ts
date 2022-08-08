import { Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { TrailerResolver } from './trailer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailerEntity } from './entities/trailer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrailerEntity])],
  providers: [TrailerResolver, TrailerService],
  exports: [TrailerService],
})
export class TrailerModule {}
