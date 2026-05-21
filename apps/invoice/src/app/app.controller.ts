import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';

import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(
    @ProcessId() processId: string,
    @RequestParams() param: { invoiceId: number; invoiceName: string },
    @RequestParams('invoiceId') invoiceId: number,
  ): Response<string> {
    console.log('processId', processId);
    console.log('param', param);
    return Response.success<string>(`Invoice ${invoiceId}`);
  }
}
