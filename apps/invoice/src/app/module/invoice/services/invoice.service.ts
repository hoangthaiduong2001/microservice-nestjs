import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { Injectable } from '@nestjs/common';
import { invoiceRequestMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(param: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(param);
    return this.invoiceRepository.create(input);
  }
}
