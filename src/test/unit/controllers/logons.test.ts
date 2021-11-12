import nock from 'nock';
import sinon from 'sinon';
import {LogonSearchRequest} from '../../../main/models/LogonSearchRequest';
import {LogonsController} from '../../../main/controllers/logons.controller';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import {LogonLog} from '../../../main/models/LogonLogs';
import {LogonAudit} from '../../../main/models/LogonAudit';
import logonLogs from '../../data/logonLogs.json';
import {Response} from 'express';

describe('Logons Controller', () => {
  const logonsController = new LogonsController();

  describe('getLogData', () => {
    it('returns valid log data - no logs', async () => {
      nock('http://localhost:4550')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          {logonLog: [], startRecordNumber: 1, moreRecords: false},
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          formState: searchRequest,
        },
      };

      return logonsController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          currentPage: 1,
        };
        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with actions <= 12', async () => {
      const logonLogs: LogonLog[] = [
        {
          'userId': '3748238',
          'emailAddress': 'Mark.Taylor@company.com',
          'service': 'idam-web-admin',
          'ipAddress': '192.158.1.38',
          'timestamp': '2021-06-23T22:20:05.293Z',
        },
        {
          'userId': '3748239',
          'emailAddress': 'Dan.Morgan@company.com',
          'service': 'idam-web-admin',
          'ipAddress': '192.151.1.28',
          'timestamp': '2020-02-02T08:16:27.234Z',
        },
      ];

      const logonAudit: LogonAudit = {
        logonLog: logonLogs,
        moreRecords: false,
        startRecordNumber: 1,
      };

      nock('http://localhost:4550')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          logonAudit,
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          formState: searchRequest,
        },
      };

      return logonsController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: '3748238'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748239'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          currentPage: 1,
        };
        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with logs > 12', async () => {
      const logonAudit: LogonAudit = {
        logonLog: logonLogs.logonLog as LogonLog[],
        moreRecords: false,
        startRecordNumber: 1,
      };

      nock('http://localhost:4550')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          logonAudit,
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          formState: searchRequest,
        },
      };

      return logonsController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: '3748201'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748202'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
            [{text: '3748203'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748204'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
            [{text: '3748205'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748206'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
            [{text: '3748207'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748208'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
            [{text: '3748209'}, {text: 'Mark.Taylor@company.com'}, {text: '192.158.1.38'}, {text: '2021-06-23 22:20:05'}],
            [{text: '3748210'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
            [{'text': '...'}, {'text': ''}, {'text': ''}, {'text': ''}],
            [{text: '3748214'}, {text: 'Dan.Morgan@company.com'}, {text: '192.151.1.28'}, {text: '2020-02-02 08:16:27'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          currentPage: 1,
        };
        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const logonAudit: LogonAudit = {
        logonLog: logonLogs.logonLog as LogonLog[],
        moreRecords: false,
        startRecordNumber: 1,
      };

      nock('http://localhost:4550')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          logonAudit,
        );

      const appRequest = {
        session: {
          formState: {
            userId: '123',
            startTimestamp: '2021-12-12T12:00:00',
            endTimestamp: '2021-12-12T12:00:01',
            page: 1,
          },
        },
        params: {
          pageNumber: 2,
        },
      };

      const res = { redirect: sinon.spy() };

      // @ts-ignore Conversion of res with spy
      return logonsController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.formState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
      });
    });
  });
});
