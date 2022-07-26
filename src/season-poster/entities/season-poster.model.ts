import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ImageModel } from '../../image/entities/image.model';
import { SeasonModel } from '../../season/entities/season.model';

@ObjectType()
@Entity('seasons_posters')
export class SeasonPosterModel {
  @Field(() => ID)
  @PrimaryColumn()
  imageId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  seasonId!: string;

  @Field(() => ImageModel)
  @ManyToOne(() => ImageModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image!: ImageModel;

  @Field(() => SeasonModel)
  @ManyToOne(() => SeasonModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  season!: SeasonModel;
}
