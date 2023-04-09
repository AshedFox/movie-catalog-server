import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { VideoVariantService } from './video-variant.service';
import { CreateVideoVariantInput } from './dto/create-video-variant.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { VideoEntity } from '../video/entities/video.entity';
import { MediaEntity } from '../media/entities/media.entity';
import { LanguageEntity } from '../language/entities/language.entity';
import { UpdateVideoVariantInput } from './dto/update-video-variant.input';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => VideoVariantEntity)
export class VideoVariantResolver {
  constructor(private readonly videoVariantService: VideoVariantService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  createVideoVariant(@Args('input') input: CreateVideoVariantInput) {
    return this.videoVariantService.create(input);
  }

  @Query(() => [VideoVariantEntity])
  getVideosVariants() {
    return this.videoVariantService.readMany();
  }

  @Query(() => VideoVariantEntity)
  getVideoVariant(@Args('id', { type: () => Int }) id: number) {
    return this.videoVariantService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  updateVideoVariant(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateVideoVariantInput,
  ) {
    return this.videoVariantService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  deleteVideoVariant(@Args('id') id: number) {
    return this.videoVariantService.delete(id);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Root() videoVariant: VideoVariantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoEntity, 'id')
      .load(videoVariant.videoId);
  }

  @ResolveField(() => MediaEntity)
  file(
    @Root() videoVariant: VideoVariantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MediaEntity, 'id')
      .load(videoVariant.fileId);
  }

  @ResolveField(() => LanguageEntity)
  language(
    @Root() videoVariant: VideoVariantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(LanguageEntity, 'id')
      .load(videoVariant.languageId);
  }
}
