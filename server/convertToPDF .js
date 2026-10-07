const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mammoth = require("mammoth");
const { PDFDocument, StandardFonts } = require("pdf-lib");

async function convertToPDF(filePath) {

  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return filePath;
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  if (ext === ".doc" || ext === ".docx") {

    const result = await mammoth.extractRawText({
      path: filePath,
    });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(result.value || "Empty Document", {
      x: 40,
      y: 780,
      size: 12,
      font,
      maxWidth: 500,
    });

  } else if (
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png"
  ) {

    const imageBuffer = await sharp(filePath)
      .png()
      .toBuffer();

    const image = await pdfDoc.embedPng(imageBuffer);

    page.drawImage(image, {
      x: 40,
      y: 200,
      width: 500,
      height: 500,
    });

  } else {

    page.drawText("Unsupported File Type", {
      x: 40,
      y: 700,
      size: 20,
    });

  }

  const pdfBytes = await pdfDoc.save();

  const output = filePath + ".pdf";

  fs.writeFileSync(output, pdfBytes);

  return output;
}

module.exports = convertToPDF;