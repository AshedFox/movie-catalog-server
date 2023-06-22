import { Field, InputType, Int } from '@nestjs/graphql';
import { CollectionUserEntity } from '../entities/collection-user.entity';

@InputType()
export class CreateCollectionUserInput
  implements Partial<CollectionUserEntity>
{
  @Field(() => Int)
  collectionId: number;

  @Field({ nullable: true })
  isWatched: boolean;

  @Field({ nullable: true })
  isBookmarked: boolean;
}
