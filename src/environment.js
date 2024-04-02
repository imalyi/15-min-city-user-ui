import api from './config';
export const APP_ENV = api.LOG_LEVEL;

export const LOG_LEVEL = APP_ENV === 'production' ? 'prod' : 'dev';