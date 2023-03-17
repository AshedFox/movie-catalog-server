import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';

@ObjectType('Media')
@Entity('media')
export class MediaEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField()
  @Column({ type: 'varchar', unique: true, length: 255 })
  publicId: string;

  @FilterableField(() => MediaTypeEnum)
  @Column({ type: 'enum', enum: MediaTypeEnum, enumName: 'media_type_enum' })
  type: MediaTypeEnum;

  @FilterableField()
  @Column({ length: 1024 })
  url: string;
}
