import joi from 'joi';
import {DataValidator} from '../../src/components/DataValidator';
import {loggerMock} from '../helpers/mocks/loggerMock';
import {StatsD} from 'hot-shots';

describe('A DataValidator', () => {
  const statsDMock    = {} as StatsD;
  statsDMock.increment = () => undefined;
  const joiSchema     = joi.string().required();
  const dataValidator = new DataValidator<string>(loggerMock, statsDMock, joiSchema);

  it('Can validate data', () => {
    expect(dataValidator.validate('valid string')).toEqual('valid string');
  });

  it('Can fail a validation', () => {
    let error: Error;

    try {
      dataValidator.validate({});
    } catch (e) {
      error = e;
    }

    expect(error!.name).toEqual('ValidationError');
  });
});