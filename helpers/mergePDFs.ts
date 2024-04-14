// yourPdfLibModule.js
import { PDFDocument } from "pdf-lib";

export const mergePDFs = async (pdfBuffers) => {
  const mergedPDF = await PDFDocument.create();

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const pages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPDF.addPage(page));
  }

  return await mergedPDF.save();
};
