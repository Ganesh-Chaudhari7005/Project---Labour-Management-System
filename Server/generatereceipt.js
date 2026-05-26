import puppeteer from "puppeteer-core";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateReceipt = async (data) => {
    console.log("data is",data);
    
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    headless: true,

    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

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
