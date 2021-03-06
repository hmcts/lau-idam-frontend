import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import {LogonsController} from '../../../main/controllers/logons.controller';

describe('Logons Route', () => {
  app.use('/logons/csv', (new LogonsController()).getPage);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/logon?')
      .reply(
        200,
        {logonLog: [], startRecordNumber: 1, moreRecords: false},
      );

    const res = await request(app).get('/logons/csv');
    expect(res.header['content-type']).toBe('text/csv; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/csv');
  });
});
