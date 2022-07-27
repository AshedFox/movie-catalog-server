import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { StudioCountryModel } from './entities/studio-country.model';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { StudioService } from '../studio/studio.service';
import { CountryService } from '../country/country.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class StudioCountryService {
  constructor(
    @InjectRepository(StudioCountryModel)
    private readonly studioCountryRepository: Repository<StudioCountryModel>,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: StudioService,
    @Inject(forwardRef(() => CountryService))
    private readonly countryService: CountryService,
  ) {}

  async create(
    studioId: number,
    countryId: number,
  ): Promise<StudioCountryModel> {
    await this.studioService.readOne(studioId);
    await this.countryService.readOne(countryId);
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (studioCountry) {
      throw new AlreadyExistsError(
        `Country with id "${countryId}" already exists for studio with id "${studioId}"`,
      );
    }
    return this.studioCountryRepository.save({ studioId, countryId });
  }

  async createStudioCountries(
    studioId: number,
    countriesIds: number[],
  ): Promise<StudioCountryModel[]> {
    return this.studioCountryRepository.save(
      countriesIds.map((countryId) => ({ countryId, studioId })),
    );
  }

  async readAll(): Promise<StudioCountryModel[]> {
    return this.studioCountryRepository.find();
  }

  async readStudiosCountries(
    studiosIds: number[],
  ): Promise<StudioCountryModel[]> {
    return this.studioCountryRepository.find({
      where: { studioId: In(studiosIds) },
      relations: {
        country: true,
      },
    });
  }

  async readOne(
    studioId: number,
    countryId: number,
  ): Promise<StudioCountryModel> {
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (!studioCountry) {
      throw new NotFoundError();
    }
    return studioCountry;
  }

  async delete(studioId: number, countryId: number): Promise<boolean> {
    const studioCountry = await this.studioCountryRepository.findOneBy({
      studioId,
      countryId,
    });
    if (!studioCountry) {
      throw new NotFoundError();
    }
    await this.studioCountryRepository.remove(studioCountry);
    return true;
  }
}
