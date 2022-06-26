import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { StudioModel } from '../../studio/entities/studio.model';
import { SeriesModel } from '../../series/entities/series.model';

@ObjectType()
@Entity('series_studios')
export class SeriesStudioModel {
  @Field(() => ID)
  @PrimaryColumn()
  seriesId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  studioId!: number;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  series!: SeriesModel;

  @Field(() => StudioModel)
  @ManyToOne(() => StudioModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio!: StudioModel;
}
