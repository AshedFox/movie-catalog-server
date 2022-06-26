import { Injectable } from '@nestjs/common';
import { CreateQualityInput } from './dto/create-quality.input';
import { UpdateQualityInput } from './dto/update-quality.input';
import { QualityModel } from './entities/quality.model';
import { Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class QualityService {
  constructor(
    @InjectRepository(QualityModel)
    private readonly qualityRepository: Repository<QualityModel>,
  ) {}

  async create(createQualityInput: CreateQualityInput) {
    const existingQuality = await this.qualityRepository.findOne({
      name: createQualityInput.name,
    });
    if (existingQuality) {
      throw new AlreadyExistsError(
        `Quality with name "${createQualityInput.name}" already exists`,
      );
    }
    return this.qualityRepository.save(createQualityInput);
  }

  async readOne(id: number): Promise<QualityModel> {
    return this.qualityRepository.findOne(id);
  }

  async readAllByIds(ids: number[]): Promise<QualityModel[]> {
    return this.qualityRepository.findByIds(ids);
  }

  async readAll(): Promise<QualityModel[]> {
    return this.qualityRepository.find();
  }

  async update(
    id: number,
    updateQualityInput: UpdateQualityInput,
  ): Promise<QualityModel> {
    const videoQuality = await this.qualityRepository.findOne(id);
    if (!videoQuality) {
      throw new NotFoundError();
    }
    return this.qualityRepository.save({
      ...videoQuality,
      ...updateQualityInput,
    });
  }

  async delete(id: number): Promise<boolean> {
    const videoQuality = await this.qualityRepository.findOne(id);
    if (!videoQuality) {
      throw new NotFoundError();
    }
    await this.qualityRepository.remove(videoQuality);
    return true;
  }
}
