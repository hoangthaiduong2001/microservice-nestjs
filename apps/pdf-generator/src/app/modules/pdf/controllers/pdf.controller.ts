import { Controller, Get } from '@nestjs/common';
import path from 'path';
import { PdfService } from '../services/pdf.service';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  printPdf() {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');

    return this.pdfService.generatePdfFromEjs(templatePath, { invoice: { id: 1 } });
  }
}
