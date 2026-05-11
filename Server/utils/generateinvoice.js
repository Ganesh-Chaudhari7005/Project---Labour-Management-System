import puppeteer from "puppeteer-core";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoice = async (data) => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    headless: true,

    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const html = await ejs.renderFile(
    path.join(__dirname, "/invoice.ejs"),
    data,
  );

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    path: `./uploads/bills/bill-${data.billno}.pdf`,
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  return pdfBuffer;
};

export default generateInvoice;
