import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';

import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

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
