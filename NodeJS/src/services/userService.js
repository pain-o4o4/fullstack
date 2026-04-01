
import e from "express";
import db from "../../models/index"
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let userExist = await checkUserEmail(email);
            if (userExist) {
                // User exists, now check the password
                // This part is not implemented in the provided code
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ["email", "roleId", "password", "firstName", "lastName"],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `OK`;
                        delete user.password; // Remove password from the user data before sending it back
                        userData.user = user;
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = `Wrong password!`;
                    }

                } else {
                    userData.errCode = 3;
                    userData.errMessage = `User's not found!`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email doesn't exist in our system. Please try other email!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    }
    )
}
let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }

            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });

}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = `Don't have users!`;
            if (userId && userId.toUpperCase() === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });

            } else if (userId && userId !== 'ALL') {
                {
                    users = await db.User.findOne({
                        where: { id: userId },
                        attributes: {
                            exclude: ['password']
                        }
                    });
                }
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
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
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "The email is already in use. Please try another email!"
                });
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    image: data.avatar,
                    roleID: data.roleID,

                    positionId: data.positionId,
                })
                // console.log(">>> check data from service: ", data);
                // console.log(">>> check hash password: ", hashPasswordFromBcrypt);
                resolve({
                    errCode: 0,
                    errmessage: "OK: A new user was update in DataBase"
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id }
            });
            if (user) {
                await user.destroy();
                resolve({
                    errCode: 0,
                    errMessage: "User deleted successfully!"
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!"
                });
            }
        } catch (error) {
            reject(error);
        }

    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleID || !data.positionId || !data.gender) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phonenumber = data.phonenumber;
                user.address = data.address;
                user.roleID = data.roleID;
                user.positionId = data.positionId;
                user.gender = data.gender;

                await user.save();
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User not found!"
                });
            }
            resolve({
                errCode: 0,
                errMessage: "OK"
            });
        } catch (error) {
            reject(error);
        }
    })
}
let getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res;

            if (!type) {
                res = await db.Allcode.findAll();
            } else {
                res = await db.Allcode.findAll({
                    where: { type: type }
                });
            }

            resolve({
                errCode: 0,
                data: res
            });

        } catch (error) {
            reject(error);
        }
    });
};
export default {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUserById: deleteUserById,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
};