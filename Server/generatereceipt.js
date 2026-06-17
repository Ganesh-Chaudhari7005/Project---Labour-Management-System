import puppeteer from "puppeteer-core";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateReceipt = async (data) => {
    console.log("data is",data);
    
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

  const html = await ejs.renderFile(
    path.join(__dirname, "./utils/paymentreceipt.ejs"),
    data,
  );

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  await page.emulateMediaType("screen");

  const pdfPath = `./uploads/receipts/receipt-${data.billno}.pdf`;

  await page.pdf({
    path: pdfPath,
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

  return pdfPath;
};

export default generateReceipt;
