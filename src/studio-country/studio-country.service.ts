import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { StudioCountryEntity } from './entities/studio-country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { StudioService } from '../studio/studio.service';
import { CountryService } from '../country/country.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';

@Injectable()
export class StudioCountryService {
  constructor(
    @InjectRepository(StudioCountryEntity)
    private readonly studioCountryRepository: Repository<StudioCountryEntity>,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: StudioService,
    @Inject(forwardRef(() => CountryService))
    private readonly countryService: CountryService,
  ) {}

  create = async (
    studioId: number,
    countryId: number,
  ): Promise<StudioCountryEntity> => {
    await this.studioService.readOne(studioId);
    await this.countryService.readOne(countryId);
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (studioCountry) {
      throw new AlreadyExistsError(
        `Studio country with studioId "${studioId}" and countryId "${countryId}" already exists!`,
      );
    }
    return this.studioCountryRepository.save({ studioId, countryId });
  };

  createManyForStudio = async (
    studioId: number,
    countriesIds: number[],
  ): Promise<StudioCountryEntity[]> =>
    this.studioCountryRepository.save(
      countriesIds.map((countryId) => ({ countryId, studioId })),
    );

  readMany = async (): Promise<StudioCountryEntity[]> =>
    this.studioCountryRepository.find();

  readManyByStudios = async (
    studiosIds: number[],
  ): Promise<StudioCountryEntity[]> =>
    this.studioCountryRepository.find({
      where: { studioId: In(studiosIds) },
      relations: {
        country: true,
      },
    });

  readOne = async (
    studioId: number,
    countryId: number,
  ): Promise<StudioCountryEntity> => {
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (!studioCountry) {
      throw new NotFoundError(
        `Studio country with studioId "${studioId}" and countryId "${countryId}" not found!`,
      );
    }
    return studioCountry;
  };

  delete = async (studioId: number, countryId: number): Promise<boolean> => {
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (!studioCountry) {
      throw new NotFoundError(
        `Studio country with studioId "${studioId}" and countryId "${countryId}" not found!`,
      );
    }
    await this.studioCountryRepository.remove(studioCountry);
    return true;
  };
}
