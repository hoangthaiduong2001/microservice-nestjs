import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoice() {
    const result = await this.invoiceClient.send<string, number>('get_invoice', 1).toPromise();
    return new ResponseDto({ data: result });
  }
}
