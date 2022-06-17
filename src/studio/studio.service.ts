import { Injectable } from '@nestjs/common';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioModel } from './entities/studio.model';
import { ILike, Repository } from 'typeorm';
import { PaginatedStudios } from './dto/paginated-studios.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(StudioModel)
    private readonly studioRepository: Repository<StudioModel>,
  ) {}

  async create(createStudioInput: CreateStudioInput): Promise<StudioModel> {
    return this.studioRepository.save(createStudioInput);
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

  async readAllByIds(ids: string[]): Promise<StudioModel[]> {
    return await this.studioRepository.findByIds(ids);
  }

  async readOne(id: string): Promise<StudioModel> {
    const studio = await this.studioRepository.findOne(id);
    if (!studio) {
      throw new NotFoundError();
    }
    return studio;
  }

  async update(
    id: string,
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

  async delete(id: string): Promise<boolean> {
    const studio = await this.studioRepository.findOne(id);
    if (!studio) {
      throw new NotFoundError();
    }
    await this.studioRepository.remove(studio);
    return true;
  }
}
