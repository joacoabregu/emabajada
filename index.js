const puppeteer = require("puppeteer");
const {
	sendTelegramNotification,
} = require("./transporter");
const logger = require("pino")();

const { launch } = puppeteer;

const URL = "https://www.cgeonline.com.ar/informacion/apertura-de-citas.html";

const run = async () => {
	logger.info("Starting scraper...");
	const browser = await launch();

	const page = await browser.newPage();

	await page.goto(URL);

	const newDate = await page.evaluate(() => {
		const rows = document.querySelectorAll("tr");

		for (let row of rows) {
			const firstColumn = row.querySelector("td:nth-child(1)");
			const dateColumn = row.querySelector("td:nth-child(2)");

			if (firstColumn && dateColumn) {
				const firstColumnText = firstColumn.innerText;

				if (
					firstColumnText.includes("Pasaportes") &&
					firstColumnText.includes("renovación y primera vez")
				) {
					const dateText = dateColumn.innerText;

					if (dateText !== "22/11/2024") {
						return dateText;
					}
				}
			}
		}
		return null;
	});

	await browser.close();

	if (newDate) {
		logger.info(`New date found: ${newDate}`);
		logger.info("Sending email...");
		await sendTelegramNotification(newDate);
		logger.info("Email sent successfully.");
	}

	logger.info("Scraper finished successfully.");
};

const start = async () => {
	try {
		await run();
	} catch (error) {
		logger.error(error);
	}
};

start();
