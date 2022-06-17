import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModel } from './entities/person.model';

@Module({
  imports: [TypeOrmModule.forFeature([PersonModel])],
  providers: [PersonResolver, PersonService],
  exports: [PersonService],
})
export class PersonModule {}
