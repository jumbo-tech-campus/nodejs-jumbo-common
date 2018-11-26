import joi from 'joi';
import {DataValidator} from '../../src/components/DataValidator';
import {loggerMock} from '../helpers/mocks/loggerMock';

describe('A DataValidator', () => {
  const joiSchema = joi.string().required();
  const dataValidator = new DataValidator(loggerMock, joiSchema);

  it('Can validate data', async () => {
    await dataValidator.validate('valid string').catch(() => {
      fail('Should not throw an error');
    });
  });

  it('Can fail a validation', async () => {
    let error: Error;

    try {
      await dataValidator.validate({});
    } catch (e) {
      error = e;
    }

    expect(error!.name).toEqual('ValidationError');
  });
});