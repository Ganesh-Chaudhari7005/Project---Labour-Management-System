import puppeteer from "puppeteer-core";
import ejs from "ejs";
import path from "path";
import numberToWords from "number-to-words";
import fs from "fs";
import os from 'os';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoice = async (data) => {
  const launchOptions = {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
  
      if (os.platform() === "win32") {
        launchOptions.executablePath =
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      } else {
        launchOptions.executablePath = "/usr/bin/google-chrome-stable";
      }

      const browser = await puppeteer.launch(launchOptions);


  const page = await browser.newPage();

  const amountInWords =
    numberToWords
      .toWords(Math.round(data.grandTotal))
      .replace(/\b\w/g, (c) => c.toUpperCase()) + " Rupees Only";

  const html = await ejs.renderFile(path.join(__dirname, "/invoice.ejs"), {
    ...data,
    amountInWords,
  });

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

 const pdfBuffer = await page.pdf({
   path: `./uploads/bills/bill-${data.billno}.pdf`,
   format: "A4",

   printBackground: true,

   preferCSSPageSize: true,

   margin: {
     top: "0mm",
     right: "0mm",
     bottom: "0mm",
     left: "0mm",
   },
 });
  await browser.close();

  return pdfBuffer;
};

export default generateInvoice;
