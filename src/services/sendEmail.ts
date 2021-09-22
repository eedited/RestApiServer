import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export default async function sendEmail(email: string, subject: string, Contents: string): Promise<string> {
    const REDIRECT_URI: string = 'https://developers.google.com/oauthplayground';
    const oAuth2Client: OAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });
    const accessToken: string|null|undefined = await (await oAuth2Client.getAccessToken()).token;
    if (!accessToken) return new Promise<string>(() => '');

    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.OAUTH_USER,
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken,
            // user: process.env.NODEMAILER_USER,
            // pass: process.env.NODEMAILER_PASS,
        },
    });
    try {
        const emailInfo: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: 'eedited Team 🔥 <eedited.noreply@gmail.com>',
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
