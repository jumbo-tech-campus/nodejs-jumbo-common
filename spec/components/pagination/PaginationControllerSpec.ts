import {HTTPResponse} from '../../../src/components/httprequest/HTTPResponse';
import {Pageable, PaginationController} from '../../../src/components/pagination/PaginationController';

describe('A PaginationController', () => {
  let pageableMock           = {} as Pageable;
  const paginationController = new PaginationController(pageableMock);
  let httpResponse: HTTPResponse;

  describe('Returning a status code 200', () => {
    beforeEach(() => {
      httpResponse               = {statusCode: 200} as HTTPResponse;
      pageableMock.getPage       = () => Promise.resolve(httpResponse);
      pageableMock.getTotalCount = () => Promise.resolve(7);
    });

    it('Returns response with pagination', async () => {
      const response = await paginationController.get();
      expect(Object.keys(response.body!)).toContain('pagingData');
      expect(Object.keys(response.body!)).toContain('data');

    });
  });

  describe('Returning an error', () => {
    beforeEach(() => {
      httpResponse               = {} as HTTPResponse;
      pageableMock.getPage       = () => Promise.resolve(httpResponse);
      pageableMock.getTotalCount = () => Promise.resolve(7);
    });

    it('Returns original HTTP response', async () => {
      const response = await paginationController.get();
      expect(response).toBe(httpResponse);
    });
  });
});
