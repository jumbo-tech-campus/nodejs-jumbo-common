import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';

describe('A HTTPRequestMeasurable', () => {
  let request = new HTTPRequestMeasurable({options: {}} as HTTPRequest);

  it('Should be able to return tags', () => {
    expect(request.tags).toEqual([]);
  });
});