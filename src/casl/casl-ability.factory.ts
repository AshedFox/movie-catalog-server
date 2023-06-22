import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { MovieEntity } from '../movie/entities/movie.entity';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { FilmEntity } from '../film/entities/film.entity';
import { SeriesEntity } from '../series/entities/series.entity';
import { RoomEntity } from '../room/entities/room.entity';
import { SeasonEntity } from '../season/entities/season.entity';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { ActionEnum } from '@utils/enums/action.enum';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { RoleEnum } from '@utils/enums';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';

type Subjects =
  | InferSubjects<
      | typeof MovieEntity
      | typeof FilmEntity
      | typeof SeriesEntity
      | typeof RoomEntity
      | typeof SeasonEntity
      | typeof EpisodeEntity
      | typeof UserEntity
    >
  | 'all';

export type AppAbility = MongoAbility<[ActionEnum, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity | CurrentUserDto) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === RoleEnum.Admin) {
      can(ActionEnum.MANAGE, 'all');
    } else if (user.role === RoleEnum.Moderator) {
      can(ActionEnum.CREATE, 'all');
      can(ActionEnum.UPDATE, 'all');
      can(ActionEnum.READ, 'all');
    } else {
      can(ActionEnum.READ, 'all');
      cannot(ActionEnum.READ, MovieEntity, {
        accessMode: AccessModeEnum.PRIVATE,
      });
      cannot(ActionEnum.READ, FilmEntity, {
        accessMode: AccessModeEnum.PRIVATE,
      });
      cannot(ActionEnum.READ, SeriesEntity, {
        accessMode: AccessModeEnum.PRIVATE,
      });
      cannot(ActionEnum.READ, SeasonEntity, {
        accessMode: AccessModeEnum.PRIVATE,
      });
      cannot(ActionEnum.READ, EpisodeEntity, {
        accessMode: AccessModeEnum.PRIVATE,
      });
      cannot(ActionEnum.READ, RoomEntity, {
        ownerId: {
          $ne: user.id,
        },
      });
      can(ActionEnum.CREATE, RoomEntity);
      can(ActionEnum.UPDATE, RoomEntity, { ownerId: user.id });
      can(ActionEnum.DELETE, RoomEntity, { ownerId: user.id });
      can(ActionEnum.MANAGE, RoomEntity, { ownerId: user.id });
      can(ActionEnum.MANAGE, UserEntity, { id: user.id });
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
