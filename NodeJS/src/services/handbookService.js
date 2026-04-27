import db from "../../models/index";

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                await db.Handbook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });

                resolve({
                    errCode: 0,
                    errMessage: "OK"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll({
                order: [['createdAt', 'DESC']]
            });
            if (data && data.length > 0) {
                data = data.map(item => {
                    if (item.image) {
                        // If it starts with 'http' it's already a URL, don't decode
                        const imgStr = item.image.toString();
                        if (imgStr.startsWith('http')) {
                            item.image = imgStr;
                        } else {
                            item.image = Buffer.from(item.image, 'base64').toString('binary');
                        }
                    }
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: "OK",
                data
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getDetailHandbookById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let data = await db.Handbook.findOne({
                    where: { id: id }
                });
                if (data && data.image) {
                    const imgStr = data.image.toString();
                    if (!imgStr.startsWith('http')) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    } else {
                        data.image = imgStr;
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteHandbook = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbook = await db.Handbook.findOne({
                where: { id: id }
            });
            if (!handbook) {
                resolve({
                    errCode: 2,
                    errMessage: `The handbook already not exist`
                })
            }
            await db.Handbook.destroy({
                where: { id: id }
            });

            resolve({
                errCode: 0,
                message: `The handbook is deleted`
            })
        } catch (e) {
            reject(e);
        }
    })
}

let updateHandbookData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            let handbook = await db.Handbook.findOne({
                where: { id: data.id },
                raw: false
            })
            if (handbook) {
                handbook.name = data.name;
                handbook.descriptionHTML = data.descriptionHTML;
                handbook.descriptionMarkdown = data.descriptionMarkdown;
                handbook.image = data.imageBase64;
                await handbook.save();
                resolve({
                    errCode: 0,
                    message: 'Update handbook success'
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Handbook not found'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export default {
    createHandbook,
    getAllHandbook,
    getDetailHandbookById,
    deleteHandbook,
    updateHandbookData
};
