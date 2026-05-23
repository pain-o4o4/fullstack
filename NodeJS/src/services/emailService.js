const nodemailer = require('nodemailer');
require('dotenv').config();
import db from '../../models/index';
import { replacePlaceholders } from '../utils/templateUtils';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Lấy template từ DB dựa trên statusId hoặc mặc định là CONFIRMATION
    let templateType = 'CONFIRMATION';
    if (dataSend.statusId === 'S5') templateType = 'MISSED';
    
    let template = await db.EmailTemplate.findOne({
        where: { type: templateType, language: dataSend.language || 'vi' }
    });

    if (template) {
        let subject = template.subject;
        let htmlContent = replacePlaceholders(template.content, dataSend);

        let info = await transporter.sendMail({
            from: '"BookingCare 🏥" <64anhsden@gmail.com>',
            to: dataSend.receiverEmail,
            subject: subject,
            html: htmlContent,
        });
        console.log("Message sent: %s", info.messageId);
    } else {
        console.error(`[EmailService] Missing template in DB for type: ${templateType}, language: ${dataSend.language || 'vi'}`);
    }
}


let sendRemedyEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Lấy template từ DB
    let template = await db.EmailTemplate.findOne({
        where: { type: 'REMEDY', language: dataSend.language || 'vi' }
    });

    if (template) {
        let subject = template.subject;
        let htmlContent = replacePlaceholders(template.content, dataSend);

        let info = await transporter.sendMail({
            from: '"BookingCare 🏥" <64anhsden@gmail.com>',
            to: dataSend.receiverEmail,
            subject: subject,
            html: htmlContent,
        });
        console.log("Message sent: %s", info.messageId);
    } else {
        console.error(`[EmailService] Missing template in DB for type: REMEDY, language: ${dataSend.language || 'vi'}`);
    }
}


let sendRegisterVerificationCodeEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Lấy template từ DB
    let template = await db.EmailTemplate.findOne({
        where: { type: 'VERIFICATION', language: dataSend.language || 'vi' }
    });

    if (template) {
        let subject = template.subject;
        let htmlContent = replacePlaceholders(template.content, dataSend);

        await transporter.sendMail({
            from: '"BookingCare 🏥" <64anhsden@gmail.com>',
            to: dataSend.receiverEmail,
            subject: subject,
            html: htmlContent,
        });
    } else {
        console.error(`[EmailService] Missing template in DB for type: VERIFICATION, language: ${dataSend.language || 'vi'}`);
    }
}

export default {
    sendSimpleEmail: sendSimpleEmail,
    sendRemedyEmail: sendRemedyEmail,
    sendRegisterVerificationCodeEmail: sendRegisterVerificationCodeEmail
}