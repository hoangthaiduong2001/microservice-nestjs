import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcessId } from '@common/utils/string.util';
import { MetaDataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;
    const processId = getProcessId();
    const now = Date.now();

    (req as any)[MetaDataKeys.PROCESS_ID] = processId;
    (req as any)[MetaDataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP >>> start processId=${processId}>>> path method=${method} url=${originalUrl} body=${JSON.stringify(body)} at ${new Date(now).toISOString()}`,
    );
    const originalSend = res.send.bind(res);

    res.send = (body) => {
      const durationMs = Date.now() - startTime;
      Logger.log(
        `HTTP <<< end processId=${processId}>>> path method=${method} url=${originalUrl} duration=${durationMs}ms at ${new Date().toISOString()}`,
      );
      return originalSend(body);
    };

    next();
  }
}
