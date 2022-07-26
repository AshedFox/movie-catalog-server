import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SeriesModel } from '../../series/entities/series.model';
import { ImageModel } from '../../image/entities/image.model';

@ObjectType()
@Entity('series_posters')
export class SeriesPosterModel {
  @Field(() => ID)
  @PrimaryColumn()
  imageId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  seriesId!: string;

  @Field(() => ImageModel)
  @ManyToOne(() => ImageModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image!: ImageModel;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  series!: SeriesModel;
}
