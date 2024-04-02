export const APP_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

console.log('APP_ENV:', process.env);

export const LOG_LEVEL = APP_ENV === 'production' ? 'warn' : 'log';