import DataLoader, { BatchLoadFn } from 'dataloader';
import { Injectable, Type } from '@nestjs/common';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import crypto from 'crypto';
import { IndexType } from '@utils/types';
import { camelCase, snakeCase } from 'typeorm/util/StringUtils';
import { ArgsType } from '@common/args';
import typeormQueryParser from '@common/typeorm-query-parser';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PaginationArgsType } from '@common/pagination';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DataLoaderFactory {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private readonly loaders: Record<string, DataLoader<unknown, unknown>> = {};

  private makeParentQueryBuilder = <
    Child extends object,
    Parent extends object,
    ParentKey extends keyof Parent,
  >(
    ids: ParentKey[],
    ChildClass: Type<Child>,
    childKeyName: string,
    ParentClass: Type<Parent>,
    parentKeyName: string,
    args: ArgsType<any>,
    pagination: PaginationArgsType,
    relationFieldName?: string,
  ) => {
    const childQb = this.entityManager
      .createQueryBuilder()
      .select('"c".*')
      .from(ChildClass, 'c')
      .where(`"c".${childKeyName}="p".${parentKeyName}`);

    if (relationFieldName) {
      childQb.innerJoinAndSelect(`c.${relationFieldName}`, 'r');
      typeormQueryParser.applyArgs(childQb, args ?? {}, pagination, 'r');
    } else {
      typeormQueryParser.applyArgs(childQb, args ?? {}, pagination, 'c');
    }

    return this.entityManager
      .createQueryBuilder()
      .select('"t".*')
      .from(ParentClass, 'p')
      .innerJoin(
        (qb) => {
          qb.getQuery = () => `LATERAL (${childQb.getQuery()})`;
          qb.setParameters(childQb.getParameters());
          return qb;
        },
        't',
        'TRUE',
      )
      .where(`"p".${parentKeyName} IN (:...ids)`, { ids });
  };

  private createMultipleRelationBatchFn<
    Child extends object,
    ChildKey extends keyof Child,
    Parent extends object,
    ParentKey extends keyof Parent,
    RelationKey extends keyof Child,
    Relation extends Child[RelationKey],
  >(
    ChildClass: Type<Child>,
    childKeyName: ChildKey,
    ParentClass: Type<Parent>,
    parentKeyName: ParentKey,
    relationFieldName: RelationKey,
    RelationClass: Type<Relation>,
  ): BatchLoadFn<
    {
      id: ParentKey;
      args?: ArgsType<Relation>;
      pagination?: PaginationArgsType;
    },
    Relation[]
  > {
    return async (keys) => {
      const map: { [key: IndexType]: Relation[] } = {};
      const args = keys[0].args;
      const pagination = keys[0].pagination;
      const ids = keys.map((key) => key.id);

      let data: Child[];

      if (args || pagination) {
        data = await this.makeParentQueryBuilder(
          ids,
          ChildClass,
          snakeCase(String(childKeyName)),
          ParentClass,
          snakeCase(String(parentKeyName)),
          args,
          pagination,
          String(relationFieldName),
        ).getRawMany();
      } else {
        const qb = this.entityManager.createQueryBuilder();

        qb.select('"c".*')
          .from(ChildClass, 'c')
          .innerJoinAndSelect(`c.${String(relationFieldName)}`, 'r')
          .where(`"c".${snakeCase(String(childKeyName))} IN (:...ids)`, {
            ids,
          });

        data = await qb.getRawMany();
      }

      const entityKey = String(childKeyName);
      const relationKey = String(relationFieldName);

      data.forEach((v) => {
        const result = plainToInstance(ChildClass, {});
        result[relationKey] = plainToInstance(RelationClass, {});

        for (const [key, value] of Object.entries(v)) {
          if (key.startsWith('r_')) {
            result[relationKey][camelCase(key.slice(2))] = value;
          } else {
            result[camelCase(key)] = value;
          }
        }

        if (map[result[entityKey]]) {
          map[result[entityKey]].push(result[relationKey]);
        } else {
          map[result[entityKey]] = [result[relationKey]];
        }
      });

      return ids.map((id) => map[id] ?? []);
    };
  }

  private createMultipleBatchFn<
    Child extends object,
    ChildKey extends keyof Child,
    Parent extends object,
    ParentKey extends keyof Parent,
  >(
    ChildClass: Type<Child>,
    childKeyName: ChildKey,
    ParentClass: Type<Parent>,
    parentKeyName: ParentKey,
  ): BatchLoadFn<
    { id: ParentKey; args?: ArgsType<Child>; pagination?: PaginationArgsType },
    Child[]
  > {
    return async (keys) => {
      const map: { [key: IndexType]: Child[] } = {};
      const args = keys[0].args;
      const pagination = keys[0].pagination;
      const ids = keys.map((key) => key.id);

      let data: Child[];

      if (args || pagination) {
        data = await this.makeParentQueryBuilder(
          ids,
          ChildClass,
          snakeCase(String(childKeyName)),
          ParentClass,
          snakeCase(String(parentKeyName)),
          args,
          pagination,
        ).getRawMany();
      } else {
        const qb = this.entityManager.createQueryBuilder();
        qb.select(`"c".*`)
          .from(ChildClass, 'c')
          .where(`"c".${snakeCase(String(childKeyName))} IN (:...ids)`, {
            ids,
          });
        data = await qb.getRawMany<Child>();
      }

      const entityKey = String(childKeyName);

      data.forEach((v) => {
        const result = plainToInstance(ChildClass, {});

        for (const [key, value] of Object.entries(v)) {
          result[camelCase(key)] = value;
        }

        if (map[result[entityKey]]) {
          map[result[entityKey]].push(result);
        } else {
          map[result[entityKey]] = [result];
        }
      });

      return ids.map((id) => map[id] ?? []);
    };
  }

  private createBatchFn<Entity extends object, Key extends keyof Entity>(
    EntityClass: Type<Entity>,
    keyName: Key,
  ): BatchLoadFn<Key, Entity> {
    return async (ids) => {
      const map: { [key: IndexType]: Entity } = {};

      const data = await this.entityManager
        .createQueryBuilder(EntityClass, 't')
        .whereInIds(ids)
        .getMany();

      const key = String(keyName);

      data.forEach((v) => {
        map[v[key]] = v;
      });

      return ids.map((id) => map[id] ?? null);
    };
  }

  createOrGetLoader<Entity extends object, Key extends keyof Entity>(
    EntityClass: Type<Entity>,
    keyName: Key,
  ): DataLoader<Entity[Key], Entity>;
  createOrGetLoader<
    Child extends object,
    ChildKey extends keyof Child,
    Parent extends object,
    ParentKey extends keyof Parent,
  >(
    ChildClass: Type<Child>,
    childKeyName: ChildKey,
    ParentClass: Type<Parent>,
    parentKeyName: ParentKey,
  ): DataLoader<
    {
      id: Parent[ParentKey];
      args?: ArgsType<Child>;
      pagination?: PaginationArgsType;
    },
    Child[],
    string
  >;
  createOrGetLoader<
    Child extends object,
    ChildKey extends keyof Child,
    Parent extends object,
    ParentKey extends keyof Parent,
    RelationKey extends keyof Child,
    Relation extends Child[RelationKey],
  >(
    ChildClass: Type<Child>,
    childKeyName: ChildKey,
    ParentClass: Type<Parent>,
    parentKeyName: ParentKey,
    relationFieldName: RelationKey,
    RelationClass: Type<Relation>,
  ): DataLoader<
    {
      id: Parent[ParentKey];
      args?: ArgsType<Relation>;
      pagination?: PaginationArgsType;
    },
    Relation[],
    string
  >;
  createOrGetLoader<
    ChildOrEntity extends object,
    ChildOrEntityKey extends keyof ChildOrEntity,
    Parent extends object,
    ParentKey extends keyof Parent,
    RelationKey extends keyof ChildOrEntity,
    Relation extends ChildOrEntity[RelationKey],
  >(
    ChildOrEntityClass: Type<ChildOrEntity>,
    childOrEntityKeyName: ChildOrEntityKey,
    ParentClass?: Type<Parent>,
    parentKeyName?: ParentKey,
    relationFieldName?: RelationKey,
    RelationClass?: Type<Relation>,
  ) {
    let loaderName = '';

    if (parentKeyName && ParentClass && relationFieldName && RelationClass) {
      loaderName =
        ParentClass.name +
        parentKeyName.toString() +
        ChildOrEntityClass +
        childOrEntityKeyName.toString() +
        RelationClass.name +
        relationFieldName.toString();

      if (!this.loaders[loaderName]) {
        this.loaders[loaderName] = new DataLoader(
          this.createMultipleRelationBatchFn(
            ChildOrEntityClass,
            childOrEntityKeyName,
            ParentClass,
            parentKeyName,
            relationFieldName,
            RelationClass,
          ),
          {
            cacheKeyFn: (key) =>
              crypto
                .createHash('sha256')
                .update(JSON.stringify(key))
                .digest('hex')
                .toString(),
          },
        );
      }
    } else if (parentKeyName && ParentClass) {
      loaderName =
        ParentClass.name +
        parentKeyName.toString() +
        ChildOrEntityClass +
        childOrEntityKeyName.toString();

      if (!this.loaders[loaderName]) {
        this.loaders[loaderName] = new DataLoader(
          this.createMultipleBatchFn(
            ChildOrEntityClass,
            childOrEntityKeyName,
            ParentClass,
            parentKeyName,
          ),
          {
            cacheKeyFn: (key) =>
              crypto
                .createHash('sha256')
                .update(JSON.stringify(key))
                .digest('hex')
                .toString(),
          },
        );
      }
    } else {
      loaderName = ChildOrEntityClass + childOrEntityKeyName.toString();

      if (!this.loaders[loaderName]) {
        this.loaders[loaderName] = new DataLoader(
          this.createBatchFn(ChildOrEntityClass, childOrEntityKeyName),
        );
      }
    }

    return this.loaders[loaderName];
  }

  createOrGetCountLoader<
    Entity extends object,
    GroupKey extends keyof Entity,
    CountKey extends keyof Entity,
  >(
    EntityClass: Type<Entity>,
    groupKey: GroupKey,
    countKey: CountKey,
    extra?: (qb: SelectQueryBuilder<Entity>) => void,
  ): DataLoader<Entity[GroupKey], number> {
    const groupKeyName = String(groupKey);
    const countKeyName = String(countKey);
    const loaderName = `count_${EntityClass.name}_${groupKeyName}_${countKeyName}`;

    if (!this.loaders[loaderName]) {
      this.loaders[loaderName] = new DataLoader<Entity[GroupKey], number>(
        async (keys) => {
          const map: { [key: string]: number } = {};
          const snakeGroupKeyName = snakeCase(groupKeyName);

          const qb = this.entityManager
            .createQueryBuilder(EntityClass, 't')
            .select(
              `${snakeGroupKeyName}, count(${snakeGroupKeyName}) as count`,
            )
            .groupBy(`${snakeGroupKeyName}`)
            .where(`${snakeGroupKeyName} IN (:...keys)`, { keys });

          extra && extra(qb);

          const data = await qb.getRawMany();

          data.forEach((v) => {
            map[v[snakeGroupKeyName]] = v.count;
          });

          return keys.map((key) => map[key as string] ?? 0);
        },
      );
    }

    return this.loaders[loaderName] as DataLoader<Entity[GroupKey], number>;
  }
}
