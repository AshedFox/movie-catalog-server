import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { MediaEntity } from './entities/media.entity';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { GetMediaArgs } from './dto/get-media.args';
import { PaginatedMedia } from './dto/paginated-media';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { CreateMediaInput } from './dto/create-media.input';

@UseGuards(GqlJwtAuthGuard, RolesGuard)
@Role([RoleEnum.Admin, RoleEnum.Moderator])
@Resolver(() => MediaEntity)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => MediaEntity)
  uploadMedia(@Args('input') input: CreateMediaInput) {
    return this.mediaService.create(input);
  }

  @Query(() => PaginatedMedia)
  getManyMedia(@Args() { sort, filter, ...pagination }: GetMediaArgs) {
    return this.mediaService.readMany(pagination, sort, filter);
  }

  @Query(() => MediaEntity)
  getOneMedia(@Args('id', ParseUUIDPipe) id: string) {
    return this.mediaService.readOne(id);
  }

  @Mutation(() => MediaEntity)
  deleteMedia(@Args('id', ParseUUIDPipe) id: string) {
    return this.mediaService.delete(id);
  }
}
