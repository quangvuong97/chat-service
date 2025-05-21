import { AsyncLocalStorage } from 'async_hooks';

import { DynamicModule, Global, Provider } from '@nestjs/common';
import {
  getModelToken,
  ModelDefinition,
  MongooseModule,
  SchemaFactory,
} from '@nestjs/mongoose';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';

import { MONGOOSE_EX_CUSTOM_REPOSITORY } from './mongooseCustom.decorator';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';

@Global()
export class MongooseCustomModule {
  public static forCustomRepository<T extends new (...args: unknown[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];
    const models: ModelDefinition[] = [];

    repositories.forEach((Repository) => {
      const entity = Reflect.getMetadata(
        MONGOOSE_EX_CUSTOM_REPOSITORY,
        Repository,
      );

      if (!entity) return;

      providers.push({
        inject: [getModelToken(entity.name), AsyncLocalStorage],
        provide: Repository,
        useFactory: (
          model: unknown,
          als: AsyncLocalStorage<UserContext>,
        ): typeof Repository => {
          return new Repository(model, als);
        },
      });
      const schema = SchemaFactory.createForClass(entity);
      schema.set('toJSON', { virtuals: true });
      schema.set('toObject', { virtuals: true });

      let proto = entity.prototype;
      for (
        ;
        proto && proto !== Object.prototype;
        proto = Object.getPrototypeOf(proto)
      ) {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
          if (
            typeof Object.getOwnPropertyDescriptor(proto, prop)?.value ===
              'function' &&
            prop !== 'constructor'
          ) {
            schema.methods[prop] = proto[prop];
          }
        });
      }
      models.push({ name: entity.name, schema });
    });

    return {
      module: MongooseCustomModule,
      imports: [MongooseModule.forFeature(models), AsyncLocalStorageModule],
      providers,
      exports: providers,
    };
  }
}
