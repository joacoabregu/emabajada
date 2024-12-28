const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

// Comment until sendgrid account is reactivated
/* const transporter = createTransport({
	host: "smtp.sendgrid.net",
	port: 587,
	auth: {
		user: "apikey",
		pass: process.env.SENDGRID_API_KEY,
	},
}); */

/* const sendEmail = async (newDate) => {
	const mailOptions = {
		from: "abregujoaquin@gmail.com",
		to: "abregujoaquin@gmail.com",
		subject: "NUEVA FECHA EMBAJADA",
		text: `La nueva fecha es ${newDate}`,
	};

	await transporter.sendMail(mailOptions);
}; */

const sendTelegramNotification = async (message) => {
	const botToken = process.env.TELEGRAM_TOKEN;
	const chatId = process.env.CHAT_ID;

	return axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
		chat_id: chatId,
		text: message,
	});
};

module.exports = {
	sendTelegramNotification,
};
