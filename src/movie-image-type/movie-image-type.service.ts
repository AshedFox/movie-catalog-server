import { Injectable } from '@nestjs/common';
import { MovieImageTypeEntity } from './entities/movie-image-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { CreateMovieImageTypeInput } from './dto/create-movie-image-type.input';
import { UpdateMovieImageTypeInput } from './dto/update-movie-image-type.input';
import { Repository } from 'typeorm';
import { BaseService } from '@common/services';

@Injectable()
export class MovieImageTypeService extends BaseService<
  MovieImageTypeEntity,
  CreateMovieImageTypeInput,
  UpdateMovieImageTypeInput
> {
  constructor(
    @InjectRepository(MovieImageTypeEntity)
    private readonly movieImageTypeRepository: Repository<MovieImageTypeEntity>,
  ) {
    super(movieImageTypeRepository);
  }

  create = async (createMovieImageTypeInput: CreateMovieImageTypeInput) => {
    const { name } = createMovieImageTypeInput;
    const movieImageType = await this.movieImageTypeRepository.findOneBy({
      name,
    });
    if (movieImageType) {
      throw new AlreadyExistsError(
        `Age restriction with name "${name}" already exists!`,
      );
    }
    return this.movieImageTypeRepository.save(createMovieImageTypeInput);
  };
}
