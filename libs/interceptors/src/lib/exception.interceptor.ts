import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { Request } from 'express';
import { MetaDataKeys } from '@common/constants/common.constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<ResponseDto<unknown>>): Observable<ResponseDto<unknown>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetaDataKeys.PROCESS_ID]: string; [MetaDataKeys.START_TIME]: number } =
      ctx.getRequest();
    const processId = String(request[MetaDataKeys.PROCESS_ID] ?? '');
    const startTimeValue = request[MetaDataKeys.START_TIME];
    const startTime = typeof startTimeValue === 'number' ? startTimeValue : Number(startTimeValue) || Date.now();

    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        const durationMs = Date.now() - startTime;
        data.processId = processId;
        data.duration = `${durationMs}ms`;
        return data;
      }),
      catchError((error) => {
        this.logger.error({ error });

        const durationMs = Date.now() - startTime;

        const message = error?.response?.message || error?.message || error || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const code = error?.code || error.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        const response = error.getResponse ? error.getResponse() : error.response;
        const data = response ? { ...response } : null;

        if (data && typeof data === 'object') {
          delete data.message;
          delete data.statusCode;
        }

        throw new HttpException(
          new ResponseDto({ data, message, statusCode: code, duration: `${durationMs} ms` }),
          code,
        );
      }),
    );
  }
}
