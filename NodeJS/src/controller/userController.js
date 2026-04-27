import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // 1. Kiểm tra đầu vào
    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Email and password!'
        });
    }

    try {
        // 2. Gọi service xử lý
        let userData = await userService.handleUserLogin(email, password);

        // 3. Trả về kết quả
        //  BẢO MẬT: Gửi Refresh Token qua Cookie HttpOnly
        if (userData.refreshToken) {
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Chỉ dùng https khi lên server thật
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
            });
        }

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            userData: userData.user ? userData.user : {},
            token: userData.token ? userData.token : '' // Chỉ trả về Access Token trong JSON
        });

    } catch (error) {
        // Nên có try-catch để bắt lỗi nếu Database sập hoặc Service bị lỗi
        console.error('Lỗi Login Controller:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}
let createRegister = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password ||
            !req.body.firstName || !req.body.lastName ||
            !req.body.address || !req.body.phonenumber ||
            !req.body.gender) {
            return res.status(400).json({
                errCode: 1,
                message: 'Missing required parameters!'
            });
        }
        else {
            let message = await userService.createRegisterService(req.body);
            return res.status(200).json(message);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // Lấy type từ query params
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'Success',
        users: users
    });
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}
let handleEditUser = async (req, res) => {
    let data = req.body;
    let user = await userService.updateUserData(data);
    return res.status(200).json({
        errCode: 0,
        message: 'Update user successfully!',
        users: user
    });
}
let handleDeleteUser = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing required parameters!'
        });
    }
    await userService.deleteUserById(id);
    return res.status(200).json({
        errCode: 0,
        message: 'Delete user successfully!'
    });
}
let getAllCode = async (req, res) => {
    try {
        let type = req.query.type;
        // let type = req.body.type;

        let response = await userService.getAllCodeService(type);
        // let response = await userService.getAllCodeService();

        return res.status(200).json(response);

    } catch (error) {

        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let handleRefreshToken = async (req, res) => {
    try {
        let refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ errCode: 1, message: 'Missing refresh token!' });
        let response = await userService.handleRefreshTokenService(refreshToken);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Lỗi Refresh Token Controller:', error);
        return res.status(500).json({ errCode: -1, message: 'Error from server...' });
    }
}

export default {
    createRegister: createRegister,
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleRefreshToken: handleRefreshToken

};