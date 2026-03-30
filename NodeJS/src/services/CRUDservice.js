import bcrypt from "bcryptjs";
import db from "../../models/index"
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === "1" ? true : false,
                // image: data.image,
                roleID: data.roleID,
                // positionId: data.positionId,
            })
            resolve("Create new user successfully!")
            console.log(">>> check data from service: ", data);
            console.log(">>> check hash password: ", hashPasswordFromBcrypt);
        } catch (error) {
            reject(error)
        }
        // let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        // console.log(">>> check data from service: ", data);
        // console.log(">>> check hash password: ", hashPasswordFromBcrypt);
        // return new Promise(async (resolve, reject) => { 
        //     try {
        //         await db.User.create({
        //             firstName: data.firstName,
        //             lastName: data.lastName,
        //             email: data.email,
        //             address: data.address,      
        //         })
        //         resolve("Create new user successfully!")
        //     } catch (error) {
        //         reject(error)
        //     }      
        // })
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10); // Tạo salt chuẩn ($2a$10$...)
            const hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll();
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    })
}
let updateUserData = (data) => {
    console.log(">>> check data from service: ", data);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
                resolve();
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}