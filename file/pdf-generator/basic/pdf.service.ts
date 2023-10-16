import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { ConfigService } from '../../shared/config/config.service';
import { FileService } from '../../shared/file-service/file-service';
import { BaseUtils } from '../../utils/base.utils';
import { PDFTemplateExtentions, PdfPayload } from './pdf.types';

@Injectable()
export class PdfService extends FileService<PdfPayload> {
  private readonly templatesDir = process.cwd() + '/src/templates/';

  constructor(readonly config: ConfigService) {
    super({
      localStoredDir: 'src/files/pdf',
      remoteStoredPath: "http://localhost:3001/pdf",
      fileExtention: 'pdf',
      isReplaceable: false
    });
  }

  async createBuffer(payload: PdfPayload): Promise<Buffer> {
    const html = this.getHtmlContent(payload);
    const browser = await this.createBrowserInstance();
    const page = await browser.newPage();
    await page.setContent(html);
    const buffer = await page.pdf(this.pdfPageOptions());
    await browser.close();
    return buffer;
  }

  // --------------------------------------------------------------------------------

  private getHtmlContent(payload: PdfPayload) {
    let html: string;
    let templateExtention = this.getTemplateExtention(payload);
    if (templateExtention === PDFTemplateExtentions.html) {
      html = fs.readFileSync(this.templatesDir + payload.templateName, 'utf8');
    }
    if (templateExtention === PDFTemplateExtentions.hbs) {
      const source = fs.readFileSync(
        this.templatesDir + payload.templateName,
        'utf8'
      );
      const template = handlebars.compile(source);
      html = template(payload.data ?? {});
    }
    return html;
  }

  private async createBrowserInstance(): Promise<puppeteer.Browser> {
    let browser: Promise<puppeteer.Browser>;

    if (this.config.nodeEnv === 'production') {
      browser = puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } else {
      browser = puppeteer.launch();
    }

    return browser;
  }

  private pdfPageOptions(): puppeteer.PDFOptions {
    return {
      height: '500px',
      width: '350px'
    };
  }

  private getTemplateExtention(payload: PdfPayload) {
    const splitedFileName = payload.templateName.split('.');
    let templateExtention = splitedFileName[
      splitedFileName.length - 1
    ] as unknown as PDFTemplateExtentions;
    const allowedExtentions = BaseUtils.getEnumValuesOrKeys(
      PDFTemplateExtentions,
      { return: 'values' }
    );
    const isExtentionSupport = allowedExtentions.includes(templateExtention);
    if (!isExtentionSupport) {
      throw Error('Unsupported template');
    }
    return templateExtention;
  }
}
