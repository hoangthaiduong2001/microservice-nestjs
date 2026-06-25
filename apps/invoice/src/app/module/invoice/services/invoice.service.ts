import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { firstValueFrom, map } from 'rxjs';
import { invoiceRequestMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGenerateClient: TcpClient,
  ) {}

  create(param: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(param);
    return this.invoiceRepository.create(input);
  }

  async sendById(param: SendInvoiceTcpReq, processId: string) {
    const { invoiceId, userId } = param;

    const invoice = await this.invoiceRepository.getById(invoiceId);

    if (invoice?.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
    }

    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

    //todo

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
    });

    return pdfBase64;
  }

  generatorInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGenerateClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
