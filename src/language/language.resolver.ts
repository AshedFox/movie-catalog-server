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
    const { countryCode, languageCode } = createLanguageInput;
    return this.languageService.create({
      ...createLanguageInput,
      id: `${languageCode}-${countryCode}`,
    });
  }

  @Query(() => PaginatedLanguages)
  async getLanguages(@Args() { pagination, sort, filter }: GetLanguagesArgs) {
    const [data, count] = await Promise.all([
      this.languageService.readMany(pagination, sort, filter),
      this.languageService.count(filter),
    ]);
    return {
      edges: data,
      totalCount: count,
      hasNext: pagination ? count > pagination.skip + pagination.take : false,
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
