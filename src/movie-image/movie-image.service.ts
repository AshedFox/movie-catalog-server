import { Injectable } from '@nestjs/common';
import { CreateMovieImageInput } from './dto/create-movie-image.input';
import { UpdateMovieImageInput } from './dto/update-movie-image.input';
import { MovieImageEntity } from './entities/movie-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { MediaService } from '../media/media.service';
import { AlreadyExistsError } from '@utils/errors';
import { BaseService } from '@common/services';

@Injectable()
export class MovieImageService extends BaseService<
  MovieImageEntity,
  CreateMovieImageInput,
  UpdateMovieImageInput
> {
  constructor(
    @InjectRepository(MovieImageEntity)
    private readonly movieImageRepository: Repository<MovieImageEntity>,
    private readonly movieService: MovieService,
    private readonly mediaService: MediaService,
  ) {
    super(movieImageRepository);
  }

  create = async (createMovieImageInput: CreateMovieImageInput) => {
    const { movieId, imageId, typeId } = createMovieImageInput;
    await this.movieService.readOne(movieId);
    await this.mediaService.readOne(imageId);
    const movieImage = await this.movieImageRepository.findOneBy({
      movieId,
      imageId,
      typeId,
    });
    if (movieImage) {
      throw new AlreadyExistsError(
        `Movie image with movieId "${movieId}" and imageId "${imageId}" already exists!`,
      );
    }
    return this.movieImageRepository.save(createMovieImageInput);
  };
}
