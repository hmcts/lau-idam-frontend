import {Application} from 'express';
import {LogonsController} from '../controllers/logons.controller';

export default function (app: Application): void {
  const controller = new LogonsController();

  app.get('/logons/page/:pageNumber', controller.getPage);
  app.get('/logons/csv', controller.getCsv);
}
