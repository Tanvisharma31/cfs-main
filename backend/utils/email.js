const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define the email options
  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.EMAIL_FROM_NAME && process.env.EMAIL_FROM_ADDRESS
      ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
      : "Com Financial Services Support <info@comfinserv.co>");

  const mailOptions = {
    from: fromAddress,
    to: options.email,
    subject: options.subject,
    text: options.text || options.message,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
