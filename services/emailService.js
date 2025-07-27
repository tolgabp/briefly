const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, token) {
  const verifyLink = `http://localhost:5173/verify?token=${token}`; 

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: "Confirm your email",
    html: `
      <h2>Confirm Your Email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
  });
}

module.exports = { sendVerificationEmail };
