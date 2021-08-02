import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default async function sendEmail(email: string, subject: string, Contents: string): Promise<string> {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });
    try {
        const emailInfo: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: 'eedited Team',
            to: email,
            bcc: [],
            subject,
            html: `<b>${Contents}</b>`,
        });
        return emailInfo.messageId;
    }
    catch {
        throw new Error('Email Send Error');
    }
}
