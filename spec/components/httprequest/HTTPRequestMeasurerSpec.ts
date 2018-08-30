import {HTTPRequestMeasurer} from '../../../src/components/httprequest/HTTPRequestMeasurer';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';

describe('A HTTPRequestMeasurer', () => {
  let request = new HTTPRequestMeasurer({options: {}} as HTTPRequest);

  it('Should be able to return tags', () => {
    expect(request.tags).toEqual([]);
  });
});