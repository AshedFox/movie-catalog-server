import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ImageModel } from '../../image/entities/image.model';
import { EpisodeModel } from '../../episode/entities/episode.model';

@ObjectType()
@Entity('episodes_posters')
export class EpisodePosterModel {
  @Field(() => ID)
  @PrimaryColumn()
  imageId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  episodeId!: string;

  @Field(() => ImageModel)
  @ManyToOne(() => ImageModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image!: ImageModel;

  @Field(() => EpisodeModel)
  @ManyToOne(() => EpisodeModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  episode!: EpisodeModel;
}
