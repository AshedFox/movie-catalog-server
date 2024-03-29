import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { DirectiveLocation, GraphQLDirective } from 'graphql/index';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

@Injectable()
export class GraphQLConfig implements GqlOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  createGqlOptions():
    | Promise<Omit<ApolloDriverConfig, 'driver'>>
    | Omit<ApolloDriverConfig, 'driver'> {
    return {
      context: (ctx) => {
        const { extra } = ctx;

        if (extra) {
          return {
            ...ctx,
            req: extra?.request,
            loadersFactory: new DataLoaderFactory(this.entityManager),
          };
        }
        return {
          ...ctx,
          loadersFactory: new DataLoaderFactory(this.entityManager),
        };
      },
      csrfPrevention: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      subscriptions: {
        'graphql-ws': true,
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
