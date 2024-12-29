const puppeteer = require("puppeteer");
const { sendTelegramNotification } = require("./transporter");
const logger = require("pino")();

const { launch } = puppeteer;

const URL = "https://www.cgeonline.com.ar/informacion/apertura-de-citas.html";
const SENDING_NOTIFICATION = "Sending notification...";
const NOTIFICATION_SENT = "Notification sent successfully";

const run = async () => {
	logger.info("Starting scraper...");
	const browser = await launch();

	const page = await browser.newPage();

	await page.goto(URL);

	const result = await page.evaluate(() => {
		const rows = document.querySelectorAll("tr");
		let newDate = null;
		let newStatus = null;

		for (const row of rows) {
			const firstColumn = row.querySelector("td:nth-child(1)");
			const dateColumn = row.querySelector("td:nth-child(2)");
			const statusColumn = row.querySelector("td:nth-child(3)");

			if (firstColumn && dateColumn) {
				const firstColumnText = firstColumn.innerText;

				if (
					firstColumnText.includes("Pasaportes") &&
					firstColumnText.includes("renovación y primera vez")
				) {
					const dateText = dateColumn.innerText;
					const statusText = statusColumn.innerText;

					if (dateText !== "22/11/2024") {
						newDate = dateText;
					}
					if (statusText !== "fecha por confirmar") {
						newStatus = statusText;
					}
					break;
				}
			}
		}
		return { newDate, newStatus };
	});

	await browser.close();

	const { newDate, newStatus } = result;
	if (newDate) {
		const message = `New date found: ${newDate}`;
		logger.info(message);
		logger.info(SENDING_NOTIFICATION);
		await sendTelegramNotification(message);
		logger.info(NOTIFICATION_SENT);
	}

	if (newStatus) {
		logger.info(`New status found: ${newStatus}`);
		logger.info(SENDING_NOTIFICATION);
		await sendTelegramNotification(newStatus);
		logger.info(NOTIFICATION_SENT);
	}

	logger.info("Scraper finished successfully");
};

const start = async () => {
	try {
		await run();
	} catch (error) {
		logger.error(error);
		try {
			await sendTelegramNotification(`There was an error: ${error}`);
		} catch (notificationError) {
			logger.info('There was an error sending the error notification', notificationError);
		}
	}
};

start();
