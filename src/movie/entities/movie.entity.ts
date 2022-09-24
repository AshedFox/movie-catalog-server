import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { MovieImageEntity } from '../../movie-image/entities/movie-image.entity';
import { AgeRestrictionEnum } from '../../utils/enums/age-restriction.enum';
import { AccessModeEnum } from '../../utils/enums/access-mode.enum';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { MovieGenreEntity } from '../../movie-genre/entities/movie-genre.entity';
import { StudioEntity } from '../../studio/entities/studio.entity';
import { MovieStudioEntity } from '../../movie-studio/entities/movie-studio.entity';
import { MoviePersonEntity } from '../../movie-person/entities/movie-person.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { TrailerEntity } from '../../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../../movie-review/entities/movie-review.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { MovieCountryEntity } from '../../movie-country/entities/movie-country.entity';

@ObjectType()
@Entity('movies')
@TableInheritance({ column: { name: 'type', type: 'varchar' } })
export class MovieEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  readonly type: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => AgeRestrictionEnum)
  @Column({ type: 'enum', enum: AgeRestrictionEnum })
  ageRestriction: AgeRestrictionEnum;

  @Field(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode: AccessModeEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverId?: string;

  @Field(() => ImageEntity, { nullable: true })
  @ManyToOne(() => ImageEntity, { nullable: true })
  cover?: ImageEntity;

  @Field(() => [TrailerEntity])
  @OneToMany(() => TrailerEntity, (trailer) => trailer.movie)
  trailers: TrailerEntity[];

  @Field(() => [MovieReviewEntity])
  @OneToMany(() => MovieReviewEntity, (review) => review.movie)
  reviews: MovieReviewEntity[];

  @Field(() => [GenreEntity])
  genres: GenreEntity[];

  @HideField()
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
