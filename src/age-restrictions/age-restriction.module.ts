import { Module } from '@nestjs/common';
import { AgeRestrictionService } from './age-restriction.service';
import { AgeRestrictionResolver } from './age-restriction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgeRestrictionEntity } from './entities/age-restriction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgeRestrictionEntity])],
  providers: [AgeRestrictionResolver, AgeRestrictionService],
  exports: [AgeRestrictionService],
})
export class AgeRestrictionModule {}
