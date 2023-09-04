import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioEntity } from './entities/studio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudioCountryService } from '../studio-country/studio-country.service';
import { BaseService } from '@common/services/base.service';
import { WrapperType } from '@utils/types';

@Injectable()
export class StudioService extends BaseService<
  StudioEntity,
  CreateStudioInput,
  UpdateStudioInput
> {
  constructor(
    @InjectRepository(StudioEntity)
    private readonly studioRepository: Repository<StudioEntity>,
    @Inject(forwardRef(() => StudioCountryService))
    private readonly studioCountryService: WrapperType<StudioCountryService>,
  ) {
    super(studioRepository);
  }

  create = async (
    createStudioInput: CreateStudioInput,
  ): Promise<StudioEntity> => {
    const studio = await this.studioRepository.save(createStudioInput);
    const { countriesIds } = createStudioInput;
    if (countriesIds) {
      await this.studioCountryService.createManyForStudio(
        studio.id,
        countriesIds,
      );
    }
    return studio;
  };
}
