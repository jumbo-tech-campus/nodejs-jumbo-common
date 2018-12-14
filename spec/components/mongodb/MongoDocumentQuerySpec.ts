import {MongoDocumentQuery} from '../../../src/components/mongodb/MongoDocumentQuery';
import {DocumentQuery} from 'mongoose';

describe('A MongoDocumentQuery', () => {
  const mongoDocumentMock = {} as DocumentQuery<any, any>;
  const validResult: any  = {};

  beforeEach(() => {
    mongoDocumentMock.populate = () => mongoDocumentMock;
    mongoDocumentMock.sort     = () => mongoDocumentMock;
    mongoDocumentMock.select   = () => mongoDocumentMock;
    mongoDocumentMock.exec     = () => Promise.resolve(validResult);
    mongoDocumentMock.limit    = () => mongoDocumentMock;
    mongoDocumentMock.skip     = () => mongoDocumentMock;
  });

  it('Can execute a DocumentQuery without any options', async () => {
    const mongoDocumentQuery = new MongoDocumentQuery();

    const result = await mongoDocumentQuery.execute(mongoDocumentMock);

    expect(result).toEqual(validResult);
  });

  it('Can execute a DocumentQuery with all options', async () => {
    const mongoDocumentQuery = new MongoDocumentQuery({
      populate: {
        path: 'something',
      },
      sort:     [],
      select:   'something',
      count:    5,
      offset:   5,
    });

    const result = await mongoDocumentQuery.execute(mongoDocumentMock);

    expect(result).toEqual(validResult);
  });
});