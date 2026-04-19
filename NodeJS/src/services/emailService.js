const nodemailer = require('nodemailer');
require('dotenv').config();

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

    let info = await transporter.sendMail({
        from: '"BookingCare 🏥" <64anhsden@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === 'vi' ? "Xác nhận lịch hẹn khám bệnh" : "Confirmation of medical appointment",
        html: getBodyHTMLEmail(dataSend),
    });

    console.log("Message sent: %s", info.messageId);
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #1c246d;">XÁC NHẬN THANH TOÁN THÀNH CÔNG! 🏥</h3>
                <p>Xin chào <b>${dataSend.patientName}</b>,</p>
                <p>Hệ thống BookingCare đã nhận được thanh toán cho lịch hẹn của bạn.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 10px; border: 1px solid #eee;">
                    <p style="margin: 5px 0;"><b>Bác sĩ:</b> ${dataSend.doctorName}</p>
                    <p style="margin: 5px 0;"><b>Thời gian:</b> ${dataSend.time}</p>
                    <p style="margin: 5px 0;"><b>Phòng khám:</b> ${dataSend.clinicName}</p>
                    <p style="margin: 5px 0;"><b>Địa chỉ:</b> ${dataSend.addressClinic}</p>
                </div>

                <p style="color: #27ae60; font-weight: bold;">Trạng thái: Đã xác nhận & Thanh toán thành công.</p>
                <p>Bạn không cần phải thực hiện thêm bất kỳ thao tác nào khác. Vui lòng đến phòng khám đúng giờ hẹn.</p>
                
                <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                <div style="margin-top: 20px; font-size: 0.8rem; color: #888;">
                    Đây là email tự động, vui lòng không phản hồi email này.
                </div>
            </div>
        `;
    } else {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #1c246d;">PAYMENT CONFIRMED SUCCESSFULLY! 🏥</h3>
                <p>Dear <b>${dataSend.patientName}</b>,</p>
                <p>BookingCare system has received payment for your appointment.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 10px; border: 1px solid #eee;">
                    <p style="margin: 5px 0;"><b>Doctor:</b> ${dataSend.doctorName}</p>
                    <p style="margin: 5px 0;"><b>Time:</b> ${dataSend.time}</p>
                    <p style="margin: 5px 0;"><b>Clinic:</b> ${dataSend.clinicName}</p>
                    <p style="margin: 5px 0;"><b>Address:</b> ${dataSend.addressClinic}</p>
                </div>

                <p style="color: #27ae60; font-weight: bold;">Status: Confirmed & Paid.</p>
                <p>You do not need to take any further action. Please arrive at the clinic on time.</p>
                
                <p>Thank you for choosing us!</p>
            </div>
        `;
    }
    return result;
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

    let info = await transporter.sendMail({
        from: '"BookingCare 🏥" <64anhsden@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === 'vi' ? "Kết quả khám bệnh & Cảm ơn" : "Medical examination results & Thank you",
        html: getBodyHTMLEmailRemedy(dataSend),
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #1c246d;">HOÀN TẤT KHÁM BỆNH! 🏥</h3>
                <p>Xin chào <b>${dataSend.patientName}</b>,</p>
                <p>Bạn đã hoàn tất buổi khám bệnh trên hệ thống BookingCare.</p>
                
                <div style="background-color: #f0f8ff; padding: 15px; border-radius: 10px; border: 1px solid #4a90e2;">
                    <p style="margin: 5px 0;"><b>Bác sĩ khám:</b> ${dataSend.doctorName}</p>
                    <p style="margin: 5px 0;"><b>Thời gian:</b> ${dataSend.time}</p>
                    <p style="margin: 5px 0;"><b>Phòng khám:</b> ${dataSend.clinicName}</p>
                </div>

                <p style="color: #27ae60; font-weight: bold;">Trạng thái: Đã hoàn thành (Done).</p>
                <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Kính chúc bạn nhiều sức khỏe và bình an!</p>
            </div>
        `;
    } else {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #1c246d;">MEDICAL EXAMINATION COMPLETED! 🏥</h3>
                <p>Dear <b>${dataSend.patientName}</b>,</p>
                <p>You have successfully completed your medical examination via the BookingCare system.</p>
                
                <div style="background-color: #f0f8ff; padding: 15px; border-radius: 10px; border: 1px solid #4a90e2;">
                    <p style="margin: 5px 0;"><b>Doctor:</b> ${dataSend.doctorName}</p>
                    <p style="margin: 5px 0;"><b>Time:</b> ${dataSend.time}</p>
                    <p style="margin: 5px 0;"><b>Clinic:</b> ${dataSend.clinicName}</p>
                </div>

                <p style="color: #27ae60; font-weight: bold;">Status: Completed.</p>
                <p>Thank you for choosing us. We wish you good health and a peaceful life!</p>
            </div>
        `;
    }
    return result;
}

export default {
    sendSimpleEmail: sendSimpleEmail,
    sendRemedyEmail: sendRemedyEmail
}