import db from "../../models/index";
import { parseImageFromDb, uploadImageToCloudinary, replaceImageOnCloudinary } from "../utils/imageUtils";

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let imageUrl = await uploadImageToCloudinary(data.imageBase64, 'handbooks');
                await db.Handbook.create({
                    name: data.name,
                    image: imageUrl,
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
            data = data.map(item => {
                if (item.image) {
                    item.image = parseImageFromDb(item.image);
                }
                return item;
            });
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
                    data.image = parseImageFromDb(data.image);
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

let deleteHandbook = (id, force = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbook = await db.Handbook.findOne({
                where: { id: id }
            });
            if (!handbook) {
                resolve({
                    errCode: 2,
                    errMessage: `The handbook already not exist`
                });
                return;
            }

            // SOFT DELETE (Paranoid mode)
            await handbook.destroy();

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
                let imageUrl = await replaceImageOnCloudinary(data.imageBase64, handbook.image, 'handbooks');
                handbook.name = data.name;
                handbook.descriptionHTML = data.descriptionHTML;
                handbook.descriptionMarkdown = data.descriptionMarkdown;
                handbook.image = imageUrl;
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
