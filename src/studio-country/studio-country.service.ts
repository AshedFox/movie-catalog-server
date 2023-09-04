import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { StudioCountryEntity } from './entities/studio-country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { StudioService } from '../studio/studio.service';
import { CountryService } from '../country/country.service';
import { WrapperType } from '@utils/types';

@Injectable()
export class StudioCountryService {
  constructor(
    @InjectRepository(StudioCountryEntity)
    private readonly studioCountryRepository: Repository<StudioCountryEntity>,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: WrapperType<StudioService>,
    @Inject(forwardRef(() => CountryService))
    private readonly countryService: WrapperType<CountryService>,
  ) {}

  create = async (
    studioId: number,
    countryId: string,
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
    countriesIds: string[],
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
    countryId: string,
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

  delete = async (
    studioId: number,
    countryId: string,
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
    return this.studioCountryRepository.remove(studioCountry);
  };
}
