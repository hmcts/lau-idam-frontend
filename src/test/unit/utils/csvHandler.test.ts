import {jsonToCsv} from '../../../main/util/CsvHandler';
import {LogonLogs} from '../../../main/models/LogonLogs';

const logonAuditResponse = require('../../data/logonAuditResponse.json');

describe('CsvHandler', () => {

  it('Converts logon results JSON object to CSV', async () => {
    const logonLogs = new LogonLogs(logonAuditResponse.logonLog);
    return jsonToCsv(logonLogs).then((csv) => {
      expect(csv).toBe(
        '"User Id","Email Address","Ip Address","Timestamp"\n' +
        '"3748238","Mark.Taylor@company.com","192.158.1.38","2021-06-23 22:20:05"\n' +
        '"3748239","Dan.Morgan@company.com","192.151.1.28","2020-02-02 08:16:27"',
      );
    });
  });
});
