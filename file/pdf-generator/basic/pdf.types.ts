export enum PDFTemplateExtentions {
  hbs = 'hbs',
  html = 'html'
}

export type PdfPayload = {
  templateName: `${string}.${PDFTemplateExtentions}`;
  data?: { [n in string]: any };
};