export const asyncSequence = async <T, S>(iterable: T[], callback: (value: T, index: number, array: T[]) => Promise<S>): Promise<S[]> => {
  let chain = Promise.resolve();

  const result: S[] = [];

  iterable.forEach((value, index, array) =>
    chain = chain.then(async () => {
      result.push(await callback(value, index, array));
    }));

  await chain;

  return result;
};