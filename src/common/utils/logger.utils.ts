import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

/**
 * @function createLoggerOption
 * @description This is a function for the create logger option
 */
export function createLoggerOption(appName: string) {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  };
}
