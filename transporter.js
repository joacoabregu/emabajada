const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = createTransport({
	host: "smtp.sendgrid.net",
	port: 587,
	auth: {
		user: "apikey",
		pass: process.env.SENDGRID_API_KEY,
	},
});

const sendEmail = async (newDate) => {
	const mailOptions = {
		from: "abregujoaquin@gmail.com",
		to: "abregujoaquin@gmail.com",
		subject: "NUEVA FECHA EMBAJADA",
		text: `La nueva fecha es ${newDate}`,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = {
	sendEmail,
};
