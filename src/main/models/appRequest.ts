import { Request } from 'express';
import { Session } from 'express-session';
import type { LoggerInstance } from 'winston';
import {LogonSearchRequest} from './LogonSearchRequest';

export type FormError = {
  propertyName: string;
  errorType: string;
};

export interface AppRequest<T = Partial<LogonSearchRequest>> extends Request {
  session: AppSession;
  locals: {
    env: string;
    logger: LoggerInstance;
  };
  body: T;
}

export interface AppSession extends Session {
  user: UserDetails;
  logons?: LogData;
  formState?: Partial<LogonSearchRequest>;
  errors?: FormError[];
}

export interface LogData {
  hasData: boolean;
  rows: {text:string, classes?: string}[][];
  noOfRows: number;
  startRecordNumber: number;
  moreRecords: boolean;
  currentPage: number;
}

export interface UserDetails {
  accessToken: string;
  idToken: string;
  id: string;
  roles: string[];
}
