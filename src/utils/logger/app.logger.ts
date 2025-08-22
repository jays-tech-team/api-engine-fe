import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger {
  constructor(context?: string) {
    super({ context });
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }

  actionLog(action: string, message: string) {
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const logMessage = `[${formattedDate}] [${action}] ${message}`;
    // this.log(logMessage);
  }
}
