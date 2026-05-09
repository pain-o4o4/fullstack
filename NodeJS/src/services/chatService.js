import db from "../../models/index";
import { Op } from 'sequelize';

let sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.senderId || !data.receiverId || (!data.text && !data.image)) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                // 1. Kiểm tra Role của người gửi
                let sender = await db.User.findOne({
                    where: { id: data.senderId },
                    attributes: ['roleId'],
                    raw: true
                });

                if (sender && sender.roleId === 'R2') { // DOCTOR
                    // Kiểm tra xem có lịch khám (Booking) không
                    let booking = await db.Booking.findOne({
                        where: {
                            doctorId: data.senderId,
                            patientId: data.receiverId
                        }
                    });

                    // Hoặc kiểm tra xem bệnh nhân có nhắn tin cho bác sĩ này trước đó chưa
                    let hasChattedBefore = await db.Message.findOne({
                        where: {
                            senderId: data.receiverId,
                            receiverId: data.senderId
                        }
                    });

                    if (!booking && !hasChattedBefore) {
                        return resolve({
                            errCode: 2,
                            errMessage: 'Bác sĩ không thể chủ động nhắn tin cho bệnh nhân không có lịch khám!'
                        });
                    }
                }

                let newMessage = await db.Message.create({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    text: data.text || '',
                    image: data.image || null,
                    isRead: false
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Send message succeed!',
                    data: newMessage
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getMessages = (senderId, receiverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!senderId || !receiverId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                let messages = await db.Message.findAll({
                    where: {
                        [Op.or]: [
                            { senderId: senderId, receiverId: receiverId },
                            { senderId: receiverId, receiverId: senderId }
                        ]
                    },
                    order: [['createdAt', 'ASC']],
                    raw: true
                });

                // Chuyển đổi dữ liệu ảnh sang chuẩn binary của dự án
                if (messages && messages.length > 0) {
                    messages = messages.map(item => {
                        if (item.image) {
                            // item.image = Buffer.from(item.image.toString(), 'base64').toString('binary');
                            item.image = Buffer.from(item.image, 'base64').toString('binary');

                        }
                        return item;
                    });
                }

                resolve({
                    errCode: 0,
                    data: messages
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getChatHistorySidebar = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                let currentUserId = Number(userId);
                console.log(">>> check sidebar for userId:", currentUserId);

                // 1. Lấy tất cả tin nhắn liên quan đến userId này (Dùng currentUserId để chuẩn kiểu Number)
                let messages = await db.Message.findAll({
                    where: {
                        [Op.or]: [
                            { senderId: currentUserId },
                            { receiverId: currentUserId }
                        ]
                    },
                    order: [['createdAt', 'DESC']],
                    raw: true
                });
                console.log(">>> Found messages count:", messages.length);

                // 2. Lọc ra danh sách các đối tác chat duy nhất và tin nhắn mới nhất
                let chatPartners = [];
                let partnerIds = new Set();

                for (let msg of messages) {
                    let partnerId = Number(msg.senderId) === currentUserId ? Number(msg.receiverId) : Number(msg.senderId);
                    if (!partnerIds.has(partnerId)) {
                        partnerIds.add(partnerId);

                        // Lấy thông tin đối tác
                        let partnerInfo = await db.User.findOne({
                            where: { id: partnerId },
                            attributes: ['id', 'firstName', 'lastName', 'image'],
                            raw: true
                        });

                        if (partnerInfo) {
                            let imageBinary = '';
                            if (partnerInfo.image) {
                                // imageBinary = Buffer.from(partnerInfo.image.toString(), 'base64').toString('binary');
                                // imageBinary = Buffer.from(partnerInfo.image, 'base64').toString('binary');
                                imageBinary = Buffer.from(partnerInfo.image, 'base64').toString('binary'); //cmnn
                            }
                            // Đếm số tin nhắn chưa đọc từ đối tác này gửi cho currentUserId
                            let unreadCount = await db.Message.count({
                                where: {
                                    senderId: partnerId,
                                    receiverId: currentUserId,
                                    isRead: false
                                }
                            });

                            chatPartners.push({
                                partner_id: partnerId,
                                text: msg.text,
                                createdAt: msg.createdAt,
                                firstName: partnerInfo.firstName,
                                lastName: partnerInfo.lastName,
                                image: imageBinary,
                                unreadCount: unreadCount
                            });
                        }
                    }
                }

                resolve({
                    errCode: 0,
                    data: chatPartners
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let searchUsersForChat = (userId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                let user = await db.User.findOne({ where: { id: userId }, raw: true });
                let results = [];

                if (user.roleId === 'R2') { // DOCTOR
                    // Chỉ tìm bệnh nhân có lịch khám với bác sĩ này
                    let whereClause = {
                        roleId: 'R3' // PATIENT
                    };
                    if (query && query.trim()) {
                        whereClause[Op.or] = [
                            { firstName: { [Op.like]: `%${query}%` } },
                            { lastName: { [Op.like]: `%${query}%` } }
                        ];
                    }

                    results = await db.User.findAll({
                        where: whereClause,
                        include: [{
                            model: db.Booking,
                            as: 'patientBookingData',
                            where: { doctorId: userId },
                            attributes: []
                        }],
                        attributes: ['id', 'firstName', 'lastName', 'image'],
                        raw: true
                    });
                } else { // PATIENT or ADMIN
                    // Tìm bác sĩ
                    let whereClause = {
                        roleId: 'R2' // DOCTOR
                    };
                    if (query && query.trim()) {
                        whereClause[Op.or] = [
                            { firstName: { [Op.like]: `%${query}%` } },
                            { lastName: { [Op.like]: `%${query}%` } }
                        ];
                    }

                    results = await db.User.findAll({
                        where: whereClause,
                        attributes: ['id', 'firstName', 'lastName', 'image'],
                        raw: true
                    });
                }

                // Chuyển đổi ảnh sang chuẩn binary của dự án (Lưu ý: image trong DB là chuỗi base64)
                if (results && results.length > 0) {
                    results = results.map(item => {
                        if (item.image) {
                            item.image = Buffer.from(item.image, 'base64').toString('binary'); //cmnn
                            // imageBinary = Buffer.from(partnerInfo.image, 'base64').toString('binary');

                        }
                        return item;
                    });
                }

                resolve({
                    errCode: 0,
                    data: results
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteConversation = (userId, partnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !partnerId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                await db.Message.destroy({
                    where: {
                        [Op.or]: [
                            { senderId: userId, receiverId: partnerId },
                            { senderId: partnerId, receiverId: userId }
                        ]
                    }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete conversation succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let markMessagesAsRead = (userId, partnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !partnerId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                await db.Message.update({ isRead: true }, {
                    where: {
                        senderId: partnerId,
                        receiverId: userId,
                        isRead: false
                    }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Mark messages as read succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getQuickReplies = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                let data = await db.QuickReply.findAll({
                    where: { doctorId: doctorId },
                    raw: true
                });
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let saveQuickReply = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                if (data.id) {
                    await db.QuickReply.update({ content: data.content }, {
                        where: { id: data.id, doctorId: data.doctorId }
                    });
                } else {
                    await db.QuickReply.create({
                        doctorId: data.doctorId,
                        content: data.content
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save quick reply succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteQuickReply = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                await db.QuickReply.destroy({
                    where: { id: id }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete quick reply succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    sendMessage: sendMessage,
    getMessages: getMessages,
    getChatHistorySidebar: getChatHistorySidebar,
    searchUsersForChat: searchUsersForChat,
    deleteConversation: deleteConversation,
    markMessagesAsRead: markMessagesAsRead,
    getQuickReplies: getQuickReplies,
    saveQuickReply: saveQuickReply,
    deleteQuickReply: deleteQuickReply
};
