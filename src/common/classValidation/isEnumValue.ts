import { Transform, TransformFnParams } from 'class-transformer';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { TransformUtils } from '../utils/transform.utils';

/**
 * @decorator IsEnumValue
 * @description Decorator custom to validate and transform value to enum.
 * Combines both validation and transformation in one decorator.
 * Supports excluding specific enum values through the excludeKeys option.
 * Usage example:
 * ```typescript
 * enum UserRole {
 *   ADMIN = 1,
 *   USER = 2,
 *   GUEST = 3
 * }
 * class UserDto {
 *   @IsEnumValue(UserRole)
 *   role: UserRole;
 *
 *   // Exclude GUEST
 *   @IsEnumValue(UserRole, { excludeKeys: ['GUEST', 'USER'] })
 *   restrictedRole: Exclude<UserRole, 'GUEST' | 'USER'>;
 * }
 * ```
 */
export function IsEnumValue<T>(
  enumObject: T,
  validationOptions?: ValidationOptions & { excludeKeys?: string[] },
) {
  return (object: object, propertyName: string) => {
    Transform((params: TransformFnParams) =>
      TransformUtils.stringToEnum(
        params.value,
        enumObject,
        validationOptions?.each || false,
      ),
    )(object, propertyName);
    registerDecorator({
      name: 'isEnumKeyAndTransform',
      target: object.constructor,
      propertyName,
      constraints: [enumObject],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          const [enumObj] = args.constraints;
          const excludeKeys = validationOptions?.excludeKeys
            ? validationOptions.excludeKeys.map(
                (key) => enumObject[key as keyof T],
              )
            : [];
          const allowedKeys = Object.keys(enumObj)
            .filter(
              (key) =>
                Number.isNaN(Number(key)) &&
                !excludeKeys.includes(enumObj[key]),
            )
            .map((key) => enumObj[key]);
          return allowedKeys.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [enumObj] = args.constraints;
          const excludeKeys = validationOptions?.excludeKeys || [];
          const allowedKeys = Object.keys(enumObj)
            .filter(
              (key) => Number.isNaN(Number(key)) && !excludeKeys.includes(key),
            )
            .map((s) => s.toLocaleLowerCase());
          return `${args.property} must be one of the following values: ${allowedKeys.join(', ')}`;
        },
      },
    });
  };
}
