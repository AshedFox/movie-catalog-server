import { Injectable } from '@nestjs/common';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioModel } from './entities/studio.model';
import { ILike, Repository } from 'typeorm';
import { PaginatedStudios } from './dto/paginated-studios.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { StudioCountryService } from '../studio-country/studio-country.service';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(StudioModel)
    private readonly studioRepository: Repository<StudioModel>,
    private readonly studioCountryService: StudioCountryService,
  ) {}

  async create(createStudioInput: CreateStudioInput): Promise<StudioModel> {
    const studio = await this.studioRepository.save(createStudioInput);
    const { countriesIds } = createStudioInput;
    if (countriesIds && countriesIds.length > 0) {
      await this.studioCountryService.createStudioCountries(
        studio.id,
        countriesIds,
      );
    }
    return studio;
  }

  async readAll(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginatedStudios> {
    const [data, count] = await this.studioRepository.findAndCount({
      where: [
        name
          ? {
              name: ILike(`%${name}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: number[]): Promise<StudioModel[]> {
    return await this.studioRepository.findByIds(ids);
  }

  async readOne(id: number): Promise<StudioModel> {
    const studio = await this.studioRepository.findOne(id);
    if (!studio) {
      throw new NotFoundError(`Studio with id "${id}" not found`);
    }
    return studio;
  }

  async update(
    id: number,
    updateStudioInput: UpdateStudioInput,
  ): Promise<StudioModel> {
    const studio = await this.studioRepository.findOne(id);
    if (!studio) {
      throw new NotFoundError();
    }
    return this.studioRepository.save({
      ...studio,
      ...updateStudioInput,
    });
  }

  async delete(id: number): Promise<boolean> {
    const studio = await this.studioRepository.findOne(id);
    if (!studio) {
      throw new NotFoundError();
    }
    await this.studioRepository.remove(studio);
    return true;
  }
}
