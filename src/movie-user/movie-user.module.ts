import { Module } from '@nestjs/common';
import { MovieUserService } from './movie-user.service';
import { MovieUserResolver } from './movie-user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieUserEntity } from './entities/movie-user.entity';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieUserEntity]),
    MovieModule,
    UserModule,
  ],
  providers: [MovieUserResolver, MovieUserService],
  exports: [MovieUserService],
})
export class MovieUserModule {}
