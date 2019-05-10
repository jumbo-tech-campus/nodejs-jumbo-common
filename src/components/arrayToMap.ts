type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

export const arrayToMap = <T>(array: T[], key: keyof SubType<T, string>): Record<string, T> => {
  const record: Record<string, T> = {};

  array.forEach((item) => {
    const keyValue: string = item[key] as unknown as string;
    if (typeof keyValue !== 'string') {
      return;
    }
    record[keyValue] = item;
  });

  return record;
};