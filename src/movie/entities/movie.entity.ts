import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { MovieImageEntity } from '../../movie-image/entities/movie-image.entity';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { FilterableField, FilterableRelation } from '@common/filter';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { MovieGenreEntity } from '../../movie-genre/entities/movie-genre.entity';
import { StudioEntity } from '../../studio/entities/studio.entity';
import { MovieStudioEntity } from '../../movie-studio/entities/movie-studio.entity';
import { MoviePersonEntity } from '../../movie-person/entities/movie-person.entity';
import { Expose } from 'class-transformer';
import { MediaEntity } from '../../media/entities/media.entity';
import { MovieTypeEnum } from '@utils/enums';
import { TrailerEntity } from '../../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../../movie-review/entities/movie-review.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { MovieCountryEntity } from '../../movie-country/entities/movie-country.entity';
import { AgeRestrictionEnum } from '@utils/enums/age-restriction.enum';

@ObjectType('Movie')
@Entity('movies')
@TableInheritance({
  column: { type: 'enum', enum: MovieTypeEnum, enumName: 'movie_type_enum' },
})
export class MovieEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => MovieTypeEnum)
  @Column({ type: 'enum', enum: MovieTypeEnum, enumName: 'movie_type_enum' })
  readonly type: MovieTypeEnum;

  @FilterableField()
  @Column({ length: 255 })
  @Index()
  title: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField()
  @CreateDateColumn()
  @Expose({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  @Expose({ name: 'updated_at' })
  @Index()
  updatedAt: Date;

  @FilterableField(() => AgeRestrictionEnum, { nullable: true })
  @Column({
    type: 'enum',
    enum: AgeRestrictionEnum,
    enumName: 'age_restriction_enum',
  })
  ageRestriction?: AgeRestrictionEnum;

  @FilterableField(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    enumName: 'access_mode_enum',
    default: AccessModeEnum.PRIVATE,
  })
  @Expose({ name: 'access_mode' })
  @Index({ where: "access_mode = 'PUBLIC'" })
  accessMode: AccessModeEnum;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int8' })
  @Expose({ name: 'cover_id' })
  @Index({ where: 'cover_id IS NOT NULL' })
  coverId?: number;

  @FilterableRelation(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  cover?: MediaEntity;

  @Field(() => [TrailerEntity])
  @OneToMany(() => TrailerEntity, (trailer) => trailer.movie)
  trailers: TrailerEntity[];

  @Field(() => [MovieReviewEntity])
  @OneToMany(() => MovieReviewEntity, (review) => review.movie)
  reviews: MovieReviewEntity[];

  @Field(() => [GenreEntity])
  genres: GenreEntity[];

  @FilterableRelation(() => [MovieGenreEntity])
  @OneToMany(() => MovieGenreEntity, (filmGenre) => filmGenre.movie)
  genresConnection: MovieGenreEntity[];

  @Field(() => [StudioEntity])
  studios: StudioEntity[];

  @HideField()
  @OneToMany(() => MovieStudioEntity, (filmStudio) => filmStudio.movie)
  studiosConnection: MovieStudioEntity[];

  @Field(() => [CountryEntity])
  countries: CountryEntity[];

  @HideField()
  @OneToMany(() => MovieCountryEntity, (movieCountry) => movieCountry.movie)
  countriesConnection: MovieCountryEntity[];

  @Field(() => [MovieImageEntity])
  @OneToMany(() => MovieImageEntity, (movieImage) => movieImage.movie)
  movieImages: MovieImageEntity[];

  @Field(() => [MoviePersonEntity])
  @OneToMany(() => MoviePersonEntity, (filmPerson) => filmPerson.movie)
  moviePersons: MoviePersonEntity[];
}
