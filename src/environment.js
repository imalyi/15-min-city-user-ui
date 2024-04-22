import api from './config';

export const APP_ENV =
  api.NODE_ENV === 'production' ? 'production' : 'development';

export const LOG_LEVEL = APP_ENV === 'production' ? 'warn' : 'log';
