
import JWTAction from "../middleware/JWTAction";
import db from "../../models/index"
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import jwt from "jsonwebtoken";

const REGISTER_OTP_EXPIRE_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

const generateVerificationCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;
const isValidEmailFormat = (email) => /\S+@\S+\.\S+/.test(email);
const generateRegistrationSessionToken = (email) => jwt.sign(
    { email, scope: "register-otp" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30m" }
);
const removeRegistration = async (email) => db.Registration.destroy({ where: { email } });

let initiateRegisterService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let normalizedEmail = (data.email || "").trim().toLowerCase();
            if (!normalizedEmail || !data.password || !data.firstName || !data.lastName
                || !data.address || !data.phonenumber || !data.gender) {
                resolve({ errCode: 1, errMessage: "Missing required parameters!" });
                return;
            }
            if (!isValidEmailFormat(normalizedEmail)) {
                resolve({ errCode: 2, errMessage: "Invalid email format!" });
                return;
            }

            let existed = await checkUserEmail(normalizedEmail);
            if (existed) {
                resolve({ errCode: 3, errMessage: "The email is already in use. Please try another email!" });
                return;
            }

            let code = generateVerificationCode();
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            let currentOtp = await db.Registration.findOne({ where: { email: normalizedEmail } });

            await db.Registration.upsert({
                email: normalizedEmail,
                code,
                expiresAt: new Date(Date.now() + REGISTER_OTP_EXPIRE_MS),
                attempts: 0,
                resendCount: currentOtp ? currentOtp.resendCount : 0,
                payload: JSON.stringify({
                    email: normalizedEmail,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    image: data.avatar || null,
                    roleId: "R3",
                    positionId: "P0"
                })
            });

            await emailService.sendRegisterVerificationCodeEmail({
                receiverEmail: normalizedEmail,
                code,
                expireMinutes: 5
            });

            resolve({
                errCode: 0,
                errMessage: "Verification code sent successfully!",
                registrationSessionToken: generateRegistrationSessionToken(normalizedEmail)
            });
        } catch (error) {
            reject(error);
        }
    });
}

let resendRegisterVerificationCodeService = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let normalizedEmail = (email || "").trim().toLowerCase();
            if (!normalizedEmail) {
                resolve({ errCode: 1, errMessage: "Missing required parameter: email!" });
                return;
            }

            const otpRecord = await db.Registration.findOne({ where: { email: normalizedEmail } });
            if (!otpRecord) {
                resolve({ errCode: 2, errMessage: "Registration session not found. Please register again!" });
                return;
            }

            if (otpRecord.resendCount >= MAX_RESEND_COUNT) {
                await removeRegistration(normalizedEmail);
                resolve({ errCode: 3, errMessage: "Resend limit exceeded. Please register again!" });
                return;
            }

            const code = generateVerificationCode();
            otpRecord.code = code;
            otpRecord.expiresAt = new Date(Date.now() + REGISTER_OTP_EXPIRE_MS);
            otpRecord.attempts = 0;
            otpRecord.resendCount = otpRecord.resendCount + 1;
            await otpRecord.save();

            await emailService.sendRegisterVerificationCodeEmail({
                receiverEmail: normalizedEmail,
                code,
                expireMinutes: 5
            });

            resolve({ errCode: 0, errMessage: "Verification code resent successfully!" });
        } catch (error) {
            reject(error)
        }
    })
}

let verifyRegisterService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let normalizedEmail = (data.email || "").trim().toLowerCase();
            const verificationCode = `${data.verificationCode || ""}`.trim();
            if (!normalizedEmail || !verificationCode) {
                resolve({ errCode: 1, errMessage: "Missing required parameters!" });
                return;
            }

            const otpRecord = await db.Registration.findOne({ where: { email: normalizedEmail } });
            if (!otpRecord) {
                resolve({ errCode: 2, errMessage: "Verification session not found!" });
                return;
            }

            if (new Date(otpRecord.expiresAt).getTime() < Date.now()) {
                await removeRegistration(normalizedEmail);
                resolve({ errCode: 3, errMessage: "Verification code has expired!" });
                return;
            }

            if (otpRecord.attempts >= MAX_VERIFY_ATTEMPTS) {
                await removeRegistration(normalizedEmail);
                resolve({ errCode: 4, errMessage: "Too many failed attempts. Please register again!" });
                return;
            }

            if (`${otpRecord.code}` !== verificationCode) {
                otpRecord.attempts = otpRecord.attempts + 1;
                await otpRecord.save();
                resolve({
                    errCode: 5,
                    errMessage: "Verification code is incorrect!",
                    attemptsLeft: Math.max(0, MAX_VERIFY_ATTEMPTS - otpRecord.attempts)
                });
                return;
            }

            const existedUser = await checkUserEmail(normalizedEmail);
            if (existedUser) {
                await removeRegistration(normalizedEmail);
                resolve({ errCode: 6, errMessage: "The email is already in use. Please login instead." });
                return;
            }

            const payload = JSON.parse(otpRecord.payload || "{}");
            const createdUser = await db.User.create({
                email: payload.email,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                address: payload.address,
                phonenumber: payload.phonenumber,
                gender: payload.gender,
                image: payload.image,
                roleId: payload.roleId || "R3",
                positionId: payload.positionId || "P0",
                isVerified: true
            });
            await removeRegistration(normalizedEmail);

            const jwtPayload = { id: createdUser.id, email: createdUser.email, roleId: createdUser.roleId };
            resolve({
                errCode: 0,
                errMessage: "Register and verify account successfully!",
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    roleId: createdUser.roleId,
                    firstName: createdUser.firstName,
                    lastName: createdUser.lastName,
                    address: createdUser.address,
                    phonenumber: createdUser.phonenumber,
                    isVerified: true
                },
                token: JWTAction.createJWT(jwtPayload),
                refreshToken: JWTAction.createRefreshToken(jwtPayload)
            });
        } catch (error) {
            reject(error)
        }
    })
}

let createRegisterService = (data) => verifyRegisterService(data);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let userExist = await checkUserEmail(email);
            if (userExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: [
                        "id", "email", "roleId", "password",
                        "firstName", "lastName", "address",
                        "image", "phonenumber", "isVerified"
                    ],
                    raw: true
                });

                if (user && user.image) {
                    user.image = Buffer.from(user.image, 'base64').toString('binary');
                }

                if (user) {
                    if (user.roleId === 'R3' && user.isVerified === false) {
                        userData.errCode = 4;
                        userData.errMessage = `Account is not verified yet!`;
                        resolve(userData);
                        return;
                    }
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        // TẠO TOKEN
                        let payload = {
                            id: user.id,
                            email: user.email,
                            roleId: user.roleId
                        };
                        let token = JWTAction.createJWT(payload);
                        let refreshToken = JWTAction.createRefreshToken(payload);

                        userData.errCode = 0;
                        userData.errMessage = `OK`;
                        delete user.password;
                        userData.user = user;
                        userData.token = token; // Access Token
                        userData.refreshToken = refreshToken; // Refresh Token
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
            const salt = bcrypt.genSaltSync(10);
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
                    roleId: data.roleId,
                    positionId: data.positionId,
                    isVerified: true
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
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phonenumber = data.phonenumber;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                if (data.avatar) {
                    user.image = data.avatar;
                }
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

let handleRefreshTokenService = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Kiểm tra thẻ căn cước có thật không?
            let decoded = JWTAction.verifyRefreshToken(token);
            if (decoded) {
                // 2. Nếu thật -> Tạo thẻ tạm mới (Access Token)
                let payload = {
                    id: decoded.id,
                    email: decoded.email,
                    roleId: decoded.roleId
                };
                let newAccessToken = JWTAction.createJWT(payload);

                resolve({
                    errCode: 0,
                    newAccessToken: newAccessToken
                });
            } else {
                resolve({
                    errCode: -1,
                    errMessage: "Refresh Token không hợp lệ hoặc đã hết hạn!"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    initiateRegisterService: initiateRegisterService,
    resendRegisterVerificationCodeService: resendRegisterVerificationCodeService,
    verifyRegisterService: verifyRegisterService,
    createRegisterService: createRegisterService,
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUserById: deleteUserById,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    hashUserPassword: hashUserPassword,
    handleRefreshTokenService: handleRefreshTokenService
};
