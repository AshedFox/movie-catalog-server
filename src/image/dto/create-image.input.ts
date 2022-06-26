import { Field, InputType, Int } from '@nestjs/graphql';
import { ImageModel } from '../entities/image.model';
import { IsInt, IsOptional, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateImageInput implements Partial<ImageModel> {
  @Field()
  @IsUrl()
  baseUrl!: string;

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
