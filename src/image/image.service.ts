import { Injectable } from '@nestjs/common';
import { CreateImageInput } from './dto/create-image.input';
import { Repository } from 'typeorm';
import { ImageModel } from './entities/image.model';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  async create(createImageInput: CreateImageInput): Promise<ImageModel> {
    const existingImage = await this.imageRepository.findOne({
      url: createImageInput.url,
    });
    if (existingImage) {
      throw new AlreadyExistsError(
        `Image with url "${createImageInput.url}" already exists`,
      );
    }
    return this.imageRepository.save(createImageInput);
  }

  async readAll(): Promise<ImageModel[]> {
    return this.imageRepository.find();
  }

  async readOne(id: string): Promise<ImageModel> {
    const image = await this.imageRepository.findOne(id);
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found`);
    }
    return image;
  }

  async readAllByIds(ids: string[]): Promise<ImageModel[]> {
    return this.imageRepository.findByIds(ids);
  }

  async delete(id: string): Promise<boolean> {
    const image = await this.imageRepository.findOne(id);
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found`);
    }
    await this.imageRepository.remove(image);
    return true;
  }
}
