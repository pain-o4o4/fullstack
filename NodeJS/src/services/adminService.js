import db from "../../models/index";

let getAllEmailTemplates = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.EmailTemplate.findAll({
                order: [['createdAt', 'DESC']],
                raw: true
            });
            resolve({
                errCode: 0,
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
};

let upsertEmailTemplate = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.subject || !data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                if (data.id) {
                    await db.EmailTemplate.update({
                        type: data.type,
                        subject: data.subject,
                        content: data.content,
                        contentMarkdown: data.contentMarkdown,
                        language: data.language || 'vi'
                    }, {
                        where: { id: data.id }
                    });
                } else {
                    await db.EmailTemplate.create({
                        type: data.type,
                        subject: data.subject,
                        content: data.content,
                        contentMarkdown: data.contentMarkdown,
                        language: data.language || 'vi'
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save email template succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllGlobalQuickReplies = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.QuickReply.findAll({
                where: { isGlobal: true },
                order: [['createdAt', 'DESC']],
                raw: true
            });
            resolve({
                errCode: 0,
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
};

let upsertGlobalQuickReply = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                if (data.id) {
                    await db.QuickReply.update({
                        title: data.title,
                        content: data.content,
                        type: data.type || 'MANUAL',
                        isGlobal: true
                    }, {
                        where: { id: data.id }
                    });
                } else {
                    await db.QuickReply.create({
                        title: data.title,
                        content: data.content,
                        type: data.type || 'MANUAL',
                        isGlobal: true,
                        doctorId: 0 // Admin created global
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save global quick reply succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllEmailTemplates: getAllEmailTemplates,
    upsertEmailTemplate: upsertEmailTemplate,
    getAllGlobalQuickReplies: getAllGlobalQuickReplies,
    upsertGlobalQuickReply: upsertGlobalQuickReply
};
