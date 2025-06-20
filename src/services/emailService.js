import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { renderTemplate } from '../utils/helpers.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (options) => {
  await transporter.sendMail(options);
};

export const sendLocalizedMail = async ({
  to,
  subjectKey,
  bodyKey,
  data = {},
  lang = 'en',
}) => {
  let translations;
  try {
    const filePath = path.resolve('src/i18n', `${lang}.json`);
    translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    const filePath = path.resolve('src/i18n', `en.json`);
    translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const subject = translations.email[subjectKey] || '';
  const html = renderTemplate(translations.email[bodyKey] || '', data);
  await transporter.sendMail({ to, subject, html });
}; 