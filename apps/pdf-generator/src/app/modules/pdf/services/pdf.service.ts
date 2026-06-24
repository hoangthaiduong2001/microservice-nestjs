import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  renderEjsTemplate(templatePath: string, data: any) {
    const fullPath = path.resolve(templatePath);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`Template not found: ${fullPath}`);
    }

    return ejs.renderFile(fullPath, data);
  }

  async generatePdfFromEjs(templatePath: string, data: any) {
    const html = await this.renderEjsTemplate(templatePath, data);

    this.logger.debug({ html });

    return { html };
  }
}
