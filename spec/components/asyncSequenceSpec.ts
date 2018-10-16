import {asyncSequence} from '../../src/components/asyncSequence';

describe('An AsyncSequence', () => {
  const iterable = [
    {
      wait:  10,
      value: 0,
    }, {
      wait:  2,
      value: 1,
    }, {
      wait:  1,
      value: 2,
    },
  ];

  it('Can handle promises in sequence', async () => {
    const sequence: number[] = [];

    const callback = async (value: { wait: number, value: number }) =>
      await new Promise<number>((resolve: (value: number) => void) => {
        setTimeout(() => {
          sequence.push(value.value);

          resolve(value.value);
        }, value.wait);
      });

    const result = await asyncSequence(iterable, callback);

    expect(result).toEqual(sequence);
  });
});