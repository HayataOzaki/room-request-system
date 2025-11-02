import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.SENDGRID_API_KEY) {
    console.info("SENDGRID_API_KEY is not set. Skipping email send.");
    return;
  }

  const from = process.env.SYSTEM_FROM_EMAIL ?? "noreply@example.com";
  await sgMail.send({ to, from, subject, html });
}
