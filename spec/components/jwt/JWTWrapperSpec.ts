import {JWTWrapper} from '../../../src/components/jwt/JWTWrapper';

describe('A JWTWrapper ', () => {
  let  jwtWrapperMock = new JWTWrapper('secretkey');

  it('Should be able to sign a token', async () => {
    const token = await jwtWrapperMock.signToken({}, {});

    expect(token).toBeDefined();
  });

  it('Should throw error if no key provided', async () => {
    let  jwtWrapperMock = new JWTWrapper('');

    try {
      await jwtWrapperMock.signToken({}, {});
    } catch (error) {
      expect(error).toBeDefined();
      return;
    }

   fail();
  });
});