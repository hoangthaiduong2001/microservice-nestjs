import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { Invoice, InvoiceModel, InvoiceModelName } from '@common/schemas/invoice.schema';
import { InjectModel } from '@nestjs/mongoose';

export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  create(data: Partial<Invoice>) {
    return this.invoiceModel.create({
      ...data,
      status: INVOICE_STATUS.CREATED,
    });
  }

  getById(id: string) {
    return this.invoiceModel.findById(id);
  }

  updateById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string) {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
