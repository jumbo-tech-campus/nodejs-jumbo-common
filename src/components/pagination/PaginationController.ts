import {HTTPResponse} from '../httprequest/HTTPResponse';

export interface Pageable {
  count: number;
  offset: number;
  getPage: () => Promise<HTTPResponse>;
  getTotalCount: () => Promise<number>;
}

export class PaginationController {
  private readonly pageable: Pageable;

  public constructor(pageable: Pageable) {
    this.pageable = pageable;
  }

  public async get(): Promise<HTTPResponse> {
    const [response, totalCount] = await Promise.all([this.pageable.getPage(), this.pageable.getTotalCount()]);
    if (response.statusCode !== 200) {
      return response;
    }

    return {
      statusCode: response.statusCode,
      body:       {
        pagingData: {
          totalCount: totalCount,
          count:      this.pageable.count,
          offset:     this.pageable.offset,
        },
        data:       response.body,
      },
      headers:    response.headers,
    };
  }
}