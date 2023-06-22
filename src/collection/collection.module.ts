import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionResolver } from './collection.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity])],
  providers: [CollectionResolver, CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
