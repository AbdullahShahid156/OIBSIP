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
    const info = await transport.sendMail({
      from: `"${env.FROM_NAME || 'PizzaCraft'}" <${env.FROM_EMAIL || 'noreply@pizzacraft.com'}>`,
      to,
      subject,
      html,
      text,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`[DEV] Email preview URL: ${previewUrl}`);
    }
    logger.info(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    logger.error(`Email send failed to ${to}:`, error.message, error.code || '');
    return false;
  }
}

export default { sendEmail };
