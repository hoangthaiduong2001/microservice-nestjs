import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() param: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceService.create(param);
    return Response.success<InvoiceTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async sendById(
    @RequestParams() params: SendInvoiceTcpReq,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    const result = await this.invoiceService.sendById(params, processId);
    return Response.success<string>(result || '');
  }

  // @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.UPDATE_INVOICE_PAID)
  // async updateInvoicePaid(@RequestParams() invoiceId: string): Promise<Response<string>> {
  //   await this.invoiceService.updateInvoicePaid(invoiceId);
  //   return Response.success<string>(HTTP_MESSAGE.UPDATED);
  // }

  // @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID)
  // async getInvoiceById(@RequestParams() invoiceId: string) {
  //   const invoice = await this.invoiceService.getById(invoiceId);
  //   return Response.success<InvoiceTcpResponse>(invoice);
  // }
}
