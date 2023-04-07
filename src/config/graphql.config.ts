import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { DirectiveLocation, GraphQLDirective } from 'graphql/index';
import { DataLoaderService } from '../dataloader/data-loader.service';
import { ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

@Injectable()
export class GraphQLConfig implements GqlOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataLoaderService: DataLoaderService,
  ) {}

  createGqlOptions():
    | Promise<Omit<ApolloDriverConfig, 'driver'>>
    | Omit<ApolloDriverConfig, 'driver'> {
    return {
      context: (ctx) => ({
        ...ctx,
        loaders: this.dataLoaderService.createLoaders(),
      }),
      introspection: true,
      autoSchemaFile: 'src/schema.graphql',
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      playground: false,
      plugins: [
        this.configService.get<string>('NODE_ENV') === 'development'
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
    };
  }
}
