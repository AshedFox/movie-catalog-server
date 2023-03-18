import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { Repository } from 'typeorm';
import { UpdateMoviePersonTypeInput } from './dto/update-movie-person-type.input';
import { MoviePersonTypeEntity } from './entities/movie-person-type.entity';
import { CreateMoviePersonTypeInput } from './dto/create-movie-person-type.input';
import { BaseService } from '@common/services';

@Injectable()
export class MoviePersonTypeService extends BaseService<
  MoviePersonTypeEntity,
  CreateMoviePersonTypeInput,
  UpdateMoviePersonTypeInput
> {
  constructor(
    @InjectRepository(MoviePersonTypeEntity)
    private readonly moviePersonTypeRepository: Repository<MoviePersonTypeEntity>,
  ) {
    super(moviePersonTypeRepository);
  }

  create = async (createMoviePersonTypeInput: CreateMoviePersonTypeInput) => {
    const { name } = createMoviePersonTypeInput;
    const moviePersonType = await this.moviePersonTypeRepository.findOneBy({
      name,
    });
    if (moviePersonType) {
      throw new AlreadyExistsError(
        `Age restriction with name "${name}" already exists!`,
      );
    }
    return this.moviePersonTypeRepository.save(createMoviePersonTypeInput);
  };
}
