import { ProcessId } from '@common/decorators/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Controller, Get, Inject } from '@nestjs/common';
import { map } from 'rxjs';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<
        string,
        { invoiceId: number; invoiceName: string }
      >('get_invoice', { processId, data: { invoiceId: 1, invoiceName: 'Hoa don 1' } })
      .pipe(map((data) => new ResponseDto<string>(data)));
  }
}
