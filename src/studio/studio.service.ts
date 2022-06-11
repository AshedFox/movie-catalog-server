import { Injectable } from '@nestjs/common';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioModel } from './entities/studio.model';
import { ILike } from 'typeorm';
import { PaginatedStudios } from './dto/paginated-studios.result';

@Injectable()
export class StudioService {
  async create(createStudioInput: CreateStudioInput): Promise<StudioModel> {
    const studio = await StudioModel.create(createStudioInput);
    return studio.save();
  }

  async readAll(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginatedStudios> {
    const [data, count] = await StudioModel.findAndCount({
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

  async readOne(id: string): Promise<StudioModel> {
    return StudioModel.findOne(id);
  }

  async update(
    id: string,
    updateStudioInput: UpdateStudioInput,
  ): Promise<StudioModel> {
    await StudioModel.update(id, updateStudioInput);
    return StudioModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await StudioModel.delete(id));
  }
}
