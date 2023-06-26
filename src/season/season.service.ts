import { Injectable } from '@nestjs/common';
import { AlreadyExistsError } from '@utils/errors';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { SeasonEntity } from './entities/season.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class SeasonService extends BaseService<
  SeasonEntity,
  CreateSeasonInput,
  UpdateSeasonInput
> {
  constructor(
    @InjectRepository(SeasonEntity)
    private readonly seasonRepository: Repository<SeasonEntity>,
  ) {
    super(seasonRepository);
  }

  create = async (
    createSeasonInput: CreateSeasonInput,
  ): Promise<SeasonEntity> => {
    const { seriesId, numberInSeries } = createSeasonInput;

    const season = await this.seasonRepository.findOneBy({
      seriesId,
      numberInSeries,
    });

    if (season) {
      throw new AlreadyExistsError(
        `Season with seriesId "${seriesId}" and numberInSeries "${numberInSeries}" already exists!`,
      );
    }
    return this.seasonRepository.save(createSeasonInput);
  };
}
