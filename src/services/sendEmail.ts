import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default async function sendEmail(email: string, subject: string, Contents: string): Promise<void> {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });
    try {
        await transporter.sendMail({
            from: 'eedited',
            to: email,
            bcc: [],
            subject,
            html: `<b>${Contents}</b>`,
        }, () => {
            transporter.close();
        });
    }
    catch (err) {
        throw new Error('Email Send Error');
    }
}
