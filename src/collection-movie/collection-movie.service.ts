import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { NotFoundError } from '../utils/errors/not-found.error';
import { CollectionMovieEntity } from './entities/collection-movie.entity';
import { CollectionService } from '../collection/collection.service';

@Injectable()
export class CollectionMovieService {
  constructor(
    @InjectRepository(CollectionMovieEntity)
    private readonly collectionMovieRepository: Repository<CollectionMovieEntity>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
  ) {}

  create = async (collectionId: number, movieId: string) => {
    await this.collectionService.readOne(collectionId);
    await this.movieService.readOne(movieId);
    const collectionMovie = await this.collectionMovieRepository.findOneBy({
      collectionId,
      movieId,
    });
    if (collectionMovie) {
      throw new AlreadyExistsError(
        `Collection movie with movieId "${movieId}" and collectionId "${collectionId}" already exists!`,
      );
    }
    return this.collectionMovieRepository.save({ movieId, collectionId });
  };

  createManyForCollection = async (
    collectionId: number,
    movieIds: string[],
  ): Promise<CollectionMovieEntity[]> =>
    this.collectionMovieRepository.save(
      movieIds.map((movieId) => ({ movieId, collectionId })),
      { chunk: 100 },
    );

  readMany = async (): Promise<CollectionMovieEntity[]> =>
    this.collectionMovieRepository.find();

  readManyByCollections = async (
    collectionsIds: number[],
  ): Promise<CollectionMovieEntity[]> =>
    this.collectionMovieRepository.find({
      where: { collectionId: In(collectionsIds) },
      relations: {
        movie: true,
      },
    });

  readOne = async (
    collectionId: number,
    movieId: string,
  ): Promise<CollectionMovieEntity> => {
    const collectionMovie = await this.collectionMovieRepository.findOneBy({
      collectionId,
      movieId,
    });
    if (!collectionMovie) {
      throw new NotFoundError(
        `Collection movie with movieId "${movieId}" and collectionId "${collectionId}" not found!`,
      );
    }
    return collectionMovie;
  };

  delete = async (collectionId: number, movieId: string) => {
    const collectionMovie = await this.collectionMovieRepository.findOneBy({
      collectionId,
      movieId,
    });
    if (!collectionMovie) {
      throw new NotFoundError(
        `Collection movie with movieId "${movieId}" and collectionId "${collectionId}" not found!`,
      );
    }
    await this.collectionMovieRepository.remove(collectionMovie);
    return true;
  };
}