import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default async function sendEmail(email: string, subject: string, Contents: string): Promise<string> {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        // port: 587,
        secure: true, // SSL: 465
        auth: {
            type: 'OAuth2',
            user: process.env.OAUTH_USER,
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            // user: process.env.NODEMAILER_USER,
            // pass: process.env.NODEMAILER_PASS,
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
        transporter.close();
        return emailInfo.messageId;
    }
    catch (err) {
        throw new Error('Email Send Error');
    }
}
