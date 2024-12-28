const puppeteer = require('puppeteer');
const { sendEmail } = require('./transporter');

const { launch } = puppeteer;

const URL = 'https://www.cgeonline.com.ar/informacion/apertura-de-citas.html';

const run = async () => {
    const browser = await launch();
    
      const page = await browser.newPage();

  await page.goto(URL);

  const newDate = await page.evaluate(() => {
    const rows = document.querySelectorAll('tr'); // Seleccionar todas las filas

    for (let row of rows) {
      const firstColumn = row.querySelector('td:nth-child(1)');
      const dateColumn = row.querySelector('td:nth-child(2)');

      if (firstColumn && dateColumn) {
        const firstColumnText = firstColumn.innerText;

        if (
          firstColumnText.includes('Pasaportes') &&
          firstColumnText.includes('renovación y primera vez')
        ) {
          const dateText = dateColumn.innerText;

          if (dateText !== '22/11/2024') {
            return dateText;
          }
        }
      }
    }
    return null;
  });

  if (newDate) {
    await sendEmail(newDate);
  }

  await browser.close();

}

run();