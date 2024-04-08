import { LOG_LEVEL } from "./environment";
export const NO_OP = (message, ...optionalParams) => {};
/** Logger which outputs to the browser console */
export class ConsoleLogger {
  constructor(options) {
    const { level } = options || {};

    this.error = console.error.bind(console);
    this.warn = console.warn.bind(console);
    this.log = console.log.bind(console);


    if (level === 'warn') {
      this.log = NO_OP;
      return;
    }

  }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });