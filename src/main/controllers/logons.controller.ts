import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import {Response} from 'express';
import {LogonService} from '../service/LogonService';
import {AppRequest, LogData} from '../models/appRequest';
import {LogonLog, LogonLogs} from '../models/LogonLogs';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {jsonToCsv} from '../util/CsvHandler';

/**
 * Logons Controller class to handle logon results tab functionality
 */
@autobind
export class LogonsController {
  private logger: LoggerInstance = Logger.getLogger('LogonsController');

  private service = new LogonService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    this.logger.info('getLogData called');
    return this.service.getLogons(req).then(logons => {
      return {
        hasData: logons.logonLog.length > 0,
        rows: this.convertDataToTableRows(logons.logonLog),
        noOfRows: logons.logonLog.length,
        startRecordNumber: logons.startRecordNumber,
        moreRecords: logons.moreRecords,
        currentPage: req.session.formState.page,
      };
    });
  }

  /**
   * Function to return the next set of log data for the logon data
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.formState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    this.logger.info('Logon search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.logons = logData;
      res.redirect('/#logon-results-tab');
    }).catch((err) => {
      this.logger.error(err);
      res.redirect('/error');
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getLogons(req).then(logons => {
      const logonLogs = new LogonLogs(logons.logonLog);
      const filename = `logon ${csvDate()}.csv`;
      jsonToCsv(logonLogs).then(csv => {
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
      });
    });
  }

  private convertDataToTableRows(logs: LogonLog[]): {text:string}[][] {
    const splitList = logs.length > 12;

    const rows: {text:string}[][] = [];
    logs.slice(0, splitList ? 10 : 12).forEach((log) => {
      const row: {text: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof LogonLog) => {
        if (key !== 'service') {
          const text = key === 'timestamp' ? requestDateToFormDate(log[key]) : log[key];
          row.push({ text });
        }
      });

      rows.push(row);
    });

    if (splitList) {
      const lastLog = logs.slice(-1)[0];
      const keys = Object.keys(lastLog);

      const elipsesRow = [{text: '...'}].concat(Array(keys.length - 2).fill({text: ''}));
      rows.push(elipsesRow);

      const row: {text: string}[] = [];
      keys.forEach((key: keyof LogonLog) => {
        if (key !== 'service') {
          const text = key === 'timestamp' ? requestDateToFormDate(lastLog[key]) : lastLog[key];
          row.push({ text });
        }
      });
      rows.push(row);
    }

    return rows;
  }

}
