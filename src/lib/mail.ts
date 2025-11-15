type MailOptions = {
  subject: string
  text: string
  html?: string
  to?: string
}

const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const EMAIL_ADMIN = process.env.EMAIL_ADMIN || ''
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || ''
const SEND_MAIL = String(process.env.SEND_MAIL || 'true').toLowerCase() === 'true'

export async function sendEmailToAdmin({ subject, text, html, to }: MailOptions) {
  if (!SEND_MAIL) {
    console.log('SEND_MAIL disabled; skipping email send')
    return
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_ADMIN) {
    console.warn('SMTP not configured: missing env vars')
    return
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })

  const fromHeader = EMAIL_FROM_NAME ? `"${EMAIL_FROM_NAME}" <${SMTP_USER}>` : SMTP_USER

  const mailOptions = {
    from: fromHeader,
    to: to || EMAIL_ADMIN,
    subject,
    text,
    html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent', info.messageId)
  } catch (err) {
    console.error('Failed to send email', err)
  }
}
