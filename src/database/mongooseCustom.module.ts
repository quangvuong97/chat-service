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

/**
 * @class MongooseCustomModule
 * @description This is a class for the mongoose custom module
 */
@Global()
export class MongooseCustomModule {
  /**
   * @method forCustomRepository
   * @description This is a method for the mongoose custom module to for custom repository
   */
  public static forCustomRepository<T extends new (...args: unknown[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];
    const models: ModelDefinition[] = [];

    // For each repository, get the entity and create a provider
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

      // Create a schema for the entity
      const schema = SchemaFactory.createForClass(entity);
      schema.set('toJSON', { virtuals: true });
      schema.set('toObject', { virtuals: true });

      // Add methods to the schema
      let proto = entity.prototype;
      for (
        ;
        proto && proto !== Object.prototype;
        proto = Object.getPrototypeOf(proto)
      ) {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
          // If the property is a function and not the constructor, add it to the schema
          if (
            typeof Object.getOwnPropertyDescriptor(proto, prop)?.value ===
              'function' &&
            prop !== 'constructor'
          ) {
            schema.methods[prop] = proto[prop];
          }
        });
      }

      // Add the schema to the models
      models.push({ name: entity.name, schema });
    });

    // Return the module
    return {
      module: MongooseCustomModule,
      imports: [MongooseModule.forFeature(models), AsyncLocalStorageModule],
      providers,
      exports: providers,
    };
  }
}
