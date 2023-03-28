import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LanguageService } from './language.service';
import { LanguageEntity } from './entities/language.entity';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { PaginatedLanguages } from './dto/paginated-languages';
import { GetLanguagesArgs } from './dto/get-languages.args';

@Resolver(() => LanguageEntity)
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  @Mutation(() => LanguageEntity)
  createLanguage(@Args('input') createLanguageInput: CreateLanguageInput) {
    return this.languageService.create(createLanguageInput);
  }

  @Query(() => PaginatedLanguages)
  async getLanguages(
    @Args() { sort, filter, ...pagination }: GetLanguagesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.languageService.readMany(pagination, sort, filter),
      this.languageService.count(filter),
    ]);

    const { take, skip } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > take + skip,
        hasPreviousPage: skip > 0,
      },
    };
  }

  @Query(() => LanguageEntity)
  getLanguage(@Args('id') id: string) {
    return this.languageService.readOne(id);
  }

  @Mutation(() => LanguageEntity)
  updateLanguage(
    @Args('id') id: string,
    @Args('input') updateLanguageInput: UpdateLanguageInput,
  ) {
    return this.languageService.update(id, updateLanguageInput);
  }

  @Mutation(() => LanguageEntity)
  deleteLanguage(@Args('id') id: string) {
    return this.languageService.delete(id);
  }
}
