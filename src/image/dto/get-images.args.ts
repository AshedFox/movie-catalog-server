import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { ImageEntity } from '../entities/image.entity';

@ArgsType()
export class GetImagesArgs extends GqlArgs(ImageEntity) {}
