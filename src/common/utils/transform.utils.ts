export class TransformUtils {
  static stringToEnum<T>(value: string, enumObject: T): T[keyof T] | null;
  static stringToEnum<T>(
    value: string,
    enumObject: T,
    each: boolean,
  ): T[keyof T] | T[keyof T][] | null;
  static stringToEnum<T>(
    value: string,
    enumObject: T,
    each: true,
  ): T[keyof T][] | null;
  static stringToEnum<T>(
    value: string,
    enumObject: T,
    each: false,
  ): T[keyof T] | null;
  static stringToEnum<T>(
    value: string,
    enumObject: T,
    each?: boolean,
  ): T[keyof T] | T[keyof T][] | null {
    if (!value) return null;
    return each
      ? value
          .toString()
          .split(',')
          .map(
            (e: string) =>
              (enumObject as unknown as { [key: string]: T[keyof T] })[
                e.toString().toLocaleUpperCase()
              ],
          )
      : (enumObject as unknown as { [key: string]: T[keyof T] })[
          value.toString().toLocaleUpperCase()
        ];
  }

  static enumToStrings<T>(enumObject: T) {
    return Object.keys(enumObject as object)
      .filter((key) => Number.isNaN(Number(key)))
      .map((key: string) => key.toLocaleLowerCase());
  }

  static enumToString<T>(enumObject: T, value: T[keyof T]): string {
    return enumObject[value as keyof T]?.toString().toLocaleLowerCase() || '';
  }
}
