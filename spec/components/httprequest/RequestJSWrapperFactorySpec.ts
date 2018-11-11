import {RequestJSWrapper} from '../../../src/components/httprequest/RequestJSWrapper';
import {RequestJSWrapperFactory} from '../../../src/components/httprequest/RequestJSWrapperFactory';

describe('A RequestJSWrapperFactory', () => {
  it('Should be able to create a RequestJSWrapper', () => {
    const factory = new RequestJSWrapperFactory();

    const request = factory.create({url: 'url'});

    expect(request instanceof RequestJSWrapper).toEqual(true);
  });
});
