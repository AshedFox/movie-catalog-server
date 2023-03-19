import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { SubtitlesService } from './subtitles.service';
import { CreateSubtitlesInput } from './dto/create-subtitles.input';
import { UpdateSubtitlesInput } from './dto/update-subtitles.input';
import { SubtitlesEntity } from './entities/subtitles.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { LanguageEntity } from '../language/entities/language.entity';
import { MediaEntity } from '../media/entities/media.entity';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(() => SubtitlesEntity)
export class SubtitlesResolver {
  constructor(private readonly subtitlesService: SubtitlesService) {}

  @Mutation(() => SubtitlesEntity)
  createSubtitles(@Args('input') input: CreateSubtitlesInput) {
    return this.subtitlesService.create(input);
  }

  @Query(() => [SubtitlesEntity])
  getManySubtitles() {
    return this.subtitlesService.readMany();
  }

  @Query(() => SubtitlesEntity)
  getOneSubtitles(@Args('id', { type: () => Int }) id: number) {
    return this.subtitlesService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SubtitlesEntity)
  updateSubtitles(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateSubtitlesInput,
  ) {
    return this.subtitlesService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SubtitlesEntity)
  deleteSubtitles(@Args('id', { type: () => Int }) id: number) {
    return this.subtitlesService.delete(id);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Root() subtitles: SubtitlesEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.videoLoader.load(subtitles.videoId);
  }

  @ResolveField(() => LanguageEntity)
  language(
    @Root() subtitles: SubtitlesEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.languageLoader.load(subtitles.languageId);
  }

  @ResolveField(() => MediaEntity)
  file(
    @Root() subtitles: SubtitlesEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.mediaLoader.load(subtitles.fileId);
  }
}
