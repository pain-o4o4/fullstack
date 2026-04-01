import express from "express"
import homeController, { getHomePage } from "../controller/homeController"
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
let router = express.Router()

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)
    router.get("/crud", homeController.getCRUD)
    router.post("/post-crud", homeController.postCRUD)
    router.get("/get-crud", homeController.displayGetCRUD)
    router.get("/edit-crud/:id", homeController.editCRUD);
    router.get("/delete-crud/:id", homeController.deleteCRUD);
    router.post("/put-crud/:id", homeController.putCRUD);
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    // Trong file web.js
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);

    //rest api


    return app.use("/", router)
}

export default initWebRoutes