import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587', 10),
    secure: parseInt(env.SMTP_PORT || '587', 10) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  try {
    const transport = getTransporter();
    await transport.sendMail({
      from: `"${env.FROM_NAME || 'PizzaCraft'}" <${env.FROM_EMAIL || 'noreply@pizzacraft.com'}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    logger.error(`Email send failed to ${to}:`, error.message);
    return false;
  }
}

export default { sendEmail };
