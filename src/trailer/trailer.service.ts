import { Injectable } from '@nestjs/common';
import { CreateTrailerInput } from './dto/create-trailer.input';
import { UpdateTrailerInput } from './dto/update-trailer.input';
import { InjectRepository } from '@nestjs/typeorm';
import { TrailerEntity } from './entities/trailer.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { BaseService } from '@common/services';

@Injectable()
export class TrailerService extends BaseService<
  TrailerEntity,
  CreateTrailerInput,
  UpdateTrailerInput
> {
  constructor(
    @InjectRepository(TrailerEntity)
    private readonly trailerRepository: Repository<TrailerEntity>,
  ) {
    super(trailerRepository);
  }

  create = async (createTrailerInput: CreateTrailerInput) => {
    const { movieId, videoId } = createTrailerInput;
    const trailer = await this.trailerRepository.findBy({
      movieId,
      videoId,
    });
    if (trailer) {
      throw new AlreadyExistsError(
        `Trailer with movieId "${movieId}" and videoId "${videoId}" already exists!`,
      );
    }
    return this.trailerRepository.save(createTrailerInput);
  };

  readManyByMovies = async (moviesIds: string[]) =>
    this.trailerRepository.find({
      where: {
        movieId: In(moviesIds),
      },
    });
}
