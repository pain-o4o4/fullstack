import db from "../../models/index"
import crudService from "../services/crudService"
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        console.log(">>> check data: ", data)
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log("Lỗi tại getHomePage: ", error)
        // Trả về một thông báo lỗi thay vì để trình duyệt đợi mãi
        return res.send("Đã xảy ra lỗi trên server: " + error.message);
    }
}
let getCRUD = (req, res) => {
    return res.render("crud.ejs")
}
let postCRUD = async (req, res) => {
    let message = await crudService.createNewUser(req.body)
    return res.redirect("/crud");
}
let displayGetCRUD = async (req, res) => {
    let data = await crudService.getAllUser()
    console.log(">>> check data: ", data)
    return res.render("displayCRUD.ejs", {
        data: JSON.stringify(data)
    });
}
let editCRUD = async (req, res) => {
    let userId = req.params.id;
    console.log("id:", req.params.id)
    if (userId) {
        let userData = await crudService.getUserInfoById(userId);
        console.log(">>> check userData: ", userData);
        return res.render("editCRUD.ejs", {
            user: userData
        });
    } else {
        return res.send("User not found!")
    }
    // console.log(req.params.id);
    // return res.send("Edit CRUD")
}
let deleteCRUD = (req, res) => {
    let userId = req.params.id;
    if (userId) {
        crudService.deleteUserById(userId)
        return res.redirect("/get-crud")
    } else {
        return res.send("User not found!")
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    // Add logic to update user information in the database
    let allUsers = await crudService.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        data: JSON.stringify(allUsers)
    });
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    deleteCRUD: deleteCRUD,
    putCRUD: putCRUD

}
