
import puppeteer from "puppeteer-core";
import fs from 'fs';
async function generateInvoice() {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const page = await browser.newPage();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 30px;
        color: #333;
      }

      .invoice-box {
        max-width: 800px;
        margin: auto;
        border: 1px solid #eee;
        padding: 30px;
        box-shadow: 0 0 10px rgba(0,0,0,0.15);
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }

      .title {
        font-size: 28px;
        font-weight: bold;
        color: #2c3e50;
      }

      .details {
        text-align: right;
      }

      .client {
        margin-bottom: 30px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      table th {
        background: #2c3e50;
        color: white;
        padding: 10px;
        text-align: left;
      }

      table td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }

      .total {
        margin-top: 20px;
        text-align: right;
      }

      .total div {
        margin: 5px 0;
      }

      .grand {
        font-size: 18px;
        font-weight: bold;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>

  <body>
    <div class="invoice-box">
      
      <div class="header">
        <div>
          <div class="title">Royal Enterprises</div>
          <div>Dhayari, Pune</div>
        </div>
        <div class="details">
          <div><strong>Invoice #:</strong> 101</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="client">
        <strong>Bill To:</strong><br/>
        Ganesh Patil<br/>
        Pune, Maharashtra
      </div>

      <table>
        <thead>
          <tr>
            <th>Work</th>
            <th>Area (sq.ft)</th>
            <th>Rate (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Tile Installation</td>
            <td>500</td>
            <td>50</td>
            <td>25000</td>
          </tr>

          <tr>
            <td>Marble Polishing</td>
            <td>300</td>
            <td>40</td>
            <td>12000</td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        <div>Subtotal: ₹37000</div>
        <div>GST (18%): ₹6660</div>
        <div class="grand">Grand Total: ₹43660</div>
      </div>

      <div class="footer">
        Thank you for your business!
      </div>

    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: "invoice.pdf",
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();
  console.log("✅ Invoice PDF Generated!");
}

generateInvoice();
