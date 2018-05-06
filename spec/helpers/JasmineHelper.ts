export const asyncIt = (expectation: string, assertion: () => void) => {
  it(expectation, async(done: () => void) => {
    try {
      await assertion();
    } catch (error) {
      fail(error);
    }

    done();
  });
};