import { Module } from '@nestjs/common';
import { MovieReviewService } from './movie-review.service';
import { MovieReviewResolver } from './movie-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieReviewEntity } from './entities/movie-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieReviewEntity])],
  providers: [MovieReviewResolver, MovieReviewService],
  exports: [MovieReviewService],
})
export class MovieReviewModule {}
