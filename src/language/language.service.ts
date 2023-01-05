import { Injectable } from '@nestjs/common';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageEntity } from './entities/language.entity';
import { Repository } from 'typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class LanguageService extends BaseService<
  LanguageEntity,
  CreateLanguageInput,
  UpdateLanguageInput
> {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {
    super(languageRepository);
  }
}
