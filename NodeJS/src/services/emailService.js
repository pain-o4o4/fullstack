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
    // Sử dụng if...else để đảm bảo luôn có nội dung trả về
    if (dataSend.language === 'vi') {
        result = `
                <h3>Xin chào ${dataSend.patientName}!</h3>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống BookingCare.</p>
                <p>Thông tin đặt lịch:</p>
                <div><b>Thời gian: ${dataSend.time}</b></div>
                <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

                <p>Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
                <div>
                    <a href="${dataSend.redirectLink}" target="_blank">Click vào đây để xác nhận</a>
                </div>
                <div>Xin chân thành cảm ơn!</div>
            `;
    } else { // Mặc định là tiếng Anh nếu language không phải 'vi'
        result = `
                <h3>Dear ${dataSend.patientName}!</h3>
                <p>You received this email because you booked an online medical appointment on BookingCare.</p>
                <p>Information to schedule an appointment:</p>
                <div><b>Time: ${dataSend.time}</b></div>
                <div><b>Doctor: ${dataSend.doctorName}</b></div>

                <p>Please click on the link below to confirm and complete the medical appointment booking procedure.</p>
                <div>
                    <a href="${dataSend.redirectLink}" target="_blank">Click here to confirm</a>
                </div>
                <div>Sincerely thank!</div>
            `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}