import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';

function homeHandler(req: AppRequest, res: Response) {
  const formState = req.session?.formState || {};
  const sessionErrors = req.session?.errors || [];
  const logons = req.session?.logons;

  res.render('home/template', {
    form: formState,
    logons,
    sessionErrors,
    errors: {
      logonSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID or Email',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      startTimestamp: {
        invalid: 'Invalid \'Time from\' timestamp.',
        required: '\'Time from\' is required.',
      },
      endTimestamp: {
        invalid: 'Invalid \'Time to\' timestamp.',
        required: '\'Time to\' is required.',
      },
    },
  });
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
