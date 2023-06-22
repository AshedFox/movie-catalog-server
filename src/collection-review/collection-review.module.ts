import { Module } from '@nestjs/common';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewResolver } from './collection-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionReviewEntity } from './entities/collection-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionReviewEntity])],
  providers: [CollectionReviewResolver, CollectionReviewService],
  exports: [CollectionReviewService],
})
export class CollectionReviewModule {}
