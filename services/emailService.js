const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, token) {
  const { FRONTEND_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;
  
  if (!FRONTEND_URL || !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    throw new Error("❌ Missing required environment variables for sending verification email.");
  }

  const verifyLink = `${FRONTEND_URL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: FROM_EMAIL,
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
