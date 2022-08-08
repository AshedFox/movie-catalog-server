import { Field, InputType, Int } from '@nestjs/graphql';
import { ImageEntity } from '../entities/image.entity';
import { IsInt, IsOptional, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateImageInput implements Partial<ImageEntity> {
  @Field()
  @IsUrl()
  url: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  width?: number;
}
