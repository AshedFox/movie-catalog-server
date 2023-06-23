import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanPriceService {
  constructor(
    @InjectRepository(PlanPriceEntity)
    private readonly planPriceRepository: Repository<PlanPriceEntity>,
  ) {}

  create = (planId: string, priceId: string): Promise<PlanPriceEntity> => {
    return this.planPriceRepository.save({
      priceId,
      planId,
    });
  };

  readOne = (priceId: string, planId: string) => {
    return this.planPriceRepository.findOneBy({
      priceId,
      planId,
    });
  };
}
