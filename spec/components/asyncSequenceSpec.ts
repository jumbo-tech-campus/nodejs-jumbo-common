import {asyncSequence} from '../../src/components/asyncSequence';

describe('An AsyncSequence', () => {
  const iterable = [
    {
      wait:  10,
      value: 0
    }, {
      wait:  2,
      value: 1
    }, {
      wait:  1,
      value: 2
    }
  ];

  it('Can handle promises in sequence', async () => {
    const sequence: number[] = [];

    const callback = async (value: { wait: number, value: number }) =>
      new Promise<number>((resolve: (value: number) => void) => {
        setTimeout(() => {
          sequence.push(value.value);

          resolve(value.value);
        },         value.wait);
      });

    const result = await asyncSequence(iterable, callback);

    expect(result).toEqual(sequence);
  });

  it('Does not continue after failing promise', async () => {
    const throwError = new Error('Error');
    const sequence: number[] = [];

    let count = 0;

    const callback = async (value: { wait: number, value: number }) =>
      new Promise<number>((resolve: (value: number) => void, reject: (error: Error) => void) => {
        if (count === 1) {
          reject(throwError);
        }

        setTimeout(() => {
          sequence.push(value.value);

          resolve(value.value);
        },         value.wait);

        count++;
      });

    try {
      await asyncSequence(iterable, callback);
    } catch (error) {
      expect(error).toBe(throwError);
      expect(sequence).toEqual([0]);

      return;
    }

    fail('Should throw error');
  });
});