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

let sendResetPasswordEmail = async (dataSend) => {
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
        where: { type: 'RESET_PASSWORD', language: dataSend.language || 'vi' }
    });

    // Nếu chưa có mẫu trong DB, tự động tạo mới mẫu để lưu vào DB (On-demand Seeding)
    if (!template) {
        template = await db.EmailTemplate.create({
            type: 'RESET_PASSWORD',
            language: dataSend.language || 'vi',
            subject: dataSend.language === 'en' ? 'Reset Password BookingCare' : 'Khôi phục mật khẩu BookingCare',
            content: dataSend.language === 'en'
                ? '<h3>Hello!</h3><p>You received this email because you requested a password reset for your BookingCare account.</p><p>Please click the link below to change your password (Valid for 15 minutes):</p><p><a href="{{resetLink}}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0071e3; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>'
                : '<h3>Xin chào!</h3><p>Bạn nhận được email này vì đã gửi yêu cầu khôi phục mật khẩu cho tài khoản BookingCare.</p><p>Vui lòng nhấp vào liên kết dưới đây để tiến hành đổi mật khẩu (Liên kết có hiệu lực trong 15 phút):</p><p><a href="{{resetLink}}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0071e3; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Đổi mật khẩu</a></p><p>Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.</p>'
        });
    }

    if (template) {
        let subject = template.subject;
        let htmlContent = replacePlaceholders(template.content, dataSend);

        await transporter.sendMail({
            from: '"BookingCare 🏥" <64anhsden@gmail.com>',
            to: dataSend.receiverEmail,
            subject: subject,
            html: htmlContent,
        });
    }
}

export default {
    sendSimpleEmail: sendSimpleEmail,
    sendRemedyEmail: sendRemedyEmail,
    sendRegisterVerificationCodeEmail: sendRegisterVerificationCodeEmail,
    sendResetPasswordEmail: sendResetPasswordEmail
}